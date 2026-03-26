import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        let settings = await prisma.storeSettings.findUnique({ where: { id: "default" } });
        if (!settings) {
            settings = await prisma.storeSettings.create({ data: { id: "default", storeName: "FreshCart" } });
        }
        return NextResponse.json(settings);
    } catch (error) {
        console.error("Settings GET Error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!dbUser || dbUser.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const { storeName } = await req.json();
        if (!storeName) return NextResponse.json({ error: "Missing store name" }, { status: 400 });

        const settings = await prisma.storeSettings.upsert({
            where: { id: "default" },
            update: { storeName },
            create: { id: "default", storeName }
        });

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Settings POST Error:", error);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
