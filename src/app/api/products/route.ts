import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId");
    const isFeatured = searchParams.get("isFeatured");
    const isTrending = searchParams.get("isTrending");
    const search = searchParams.get("search");

    const query: any = {};

    if (categoryId) query.categoryId = categoryId;
    if (isFeatured === "true") query.isFeatured = true;
    if (isTrending === "true") query.isTrending = true;
    if (search) {
      query.name = { contains: search }; // SQLite does not support case-insensitive well via Prisma, but mostly ok
    }

    const products = await prisma.product.findMany({
      where: query,
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, description, price, discountPrice, stock, categoryId, images, isFeatured, isTrending } = body;

    // TODO: implement admin check

    if (!name || !slug || !description || price === undefined || stock === undefined || !categoryId || !images) {
      return new NextResponse("Missing data", { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name, slug, description, price: Number(price), discountPrice: discountPrice ? Number(discountPrice) : null,
        stock: Number(stock), categoryId, images, isFeatured, isTrending
      }
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
