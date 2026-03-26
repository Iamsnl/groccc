import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        let tickets;
        if (dbUser.role === "ADMIN") {
            tickets = await prisma.supportTicket.findMany({
                include: { user: { select: { name: true, email: true } } },
                orderBy: { createdAt: "desc" }
            });
        } else {
            tickets = await prisma.supportTicket.findMany({
                where: { userId: dbUser.id },
                orderBy: { createdAt: "desc" }
            });
        }

        return NextResponse.json(tickets);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { subject, message } = await req.json();
        if (!subject || !message) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

        const ticket = await prisma.supportTicket.create({
            data: {
                userId: dbUser.id,
                subject,
                messages: {
                    create: {
                        senderId: dbUser.id,
                        message
                    }
                }
            }
        });

        return NextResponse.json(ticket);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
