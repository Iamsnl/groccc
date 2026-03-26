import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        reviews: {
          include: { user: true }
        }
      }
    });

    if (!product) return new NextResponse("Not Found", { status: 404 });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;
    const body = await req.json();

    // TODO: implement admin check
    
    const product = await prisma.product.update({
      where: { id },
      data: body
    });

    return NextResponse.json(product);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = (await params).id;

    // TODO: implement admin check

    await prisma.product.delete({
      where: { id }
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
