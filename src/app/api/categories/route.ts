import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
    return NextResponse.json(categories);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, image } = body;

    // TODO: add admin authorization check
    if (!name || !slug) return new NextResponse("Missing data", { status: 400 });

    const category = await prisma.category.create({
      data: { name, slug, description, image }
    });

    return NextResponse.json(category);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
