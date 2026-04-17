import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { street, city, state, zipCode, country, isDefault, locationUrl } = body;

        if (!street || !city || !state || !zipCode || !country) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // If making this the default, un-default other addresses
        if (isDefault) {
            await prisma.address.updateMany({
                where: { userId: session.user.id },
                data: { isDefault: false }
            });
        }

        const newAddress = await prisma.address.create({
            data: {
                userId: session.user.id,
                street,
                city,
                state,
                zipCode,
                country,
                locationUrl,
                isDefault: isDefault || false
            }
        });

        return NextResponse.json(newAddress, { status: 201 });
    } catch (error) {
        console.error("Failed to add address:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
