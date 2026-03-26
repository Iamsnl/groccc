import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const ticket = await prisma.supportTicket.findUnique({
            where: { id: ticketId },
            include: {
                user: { select: { name: true, email: true } },
                messages: {
                    include: { sender: { select: { name: true, role: true } } },
                    orderBy: { createdAt: "asc" }
                }
            }
        });

        if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });
        if (dbUser.role !== "ADMIN" && ticket.userId !== dbUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        return NextResponse.json(ticket);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request, { params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { message } = await req.json();
        if (!message) return NextResponse.json({ error: "Missing message" }, { status: 400 });

        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const ticket = await prisma.supportTicket.findUnique({ where: { id: ticketId } });
        if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

        if (dbUser.role !== "ADMIN" && ticket.userId !== dbUser.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const newMessage = await prisma.supportMessage.create({
            data: {
                ticketId,
                senderId: dbUser.id,
                message
            }
        });

        if (ticket.status === "RESOLVED") {
            await prisma.supportTicket.update({ where: { id: ticket.id }, data: { status: "OPEN" } });
        }

        return NextResponse.json(newMessage);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = await params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { status } = await req.json();
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser || dbUser.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const ticket = await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
