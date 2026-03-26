import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const addresses = await prisma.address.findMany({
      where: { userId: session.user.id }
    });

    return NextResponse.json(addresses);
  } catch (error) {
    console.error("error fetching addresses:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { street, city, state, zipCode, country } = body;

    const address = await prisma.address.create({
      data: {
        userId: session.user.id,
        street,
        city,
        state: state || "NA",
        zipCode,
        country: country || "NA"
      }
    });

    return NextResponse.json(address);
  } catch (error) {
    console.error("error creating address:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
