import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        if (!newPassword || newPassword.length < 6) {
            return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Require old password if user already has a password set
        if (user.password) {
            if (!currentPassword) {
                return NextResponse.json({ error: "Current password is required" }, { status: 400 });
            }
            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
            }
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);

        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword }
        });

        return NextResponse.json({ message: "Password updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Password change error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
