import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

const getCachedCategories = unstable_cache(
  async () => {
    return await prisma.category.findMany({
      include: {
        _count: {
          select: { products: true }
        }
      }
    });
  },
  ['categories-list'],
  { revalidate: 3600, tags: ['categories'] }
);

export async function GET() {
  try {
    const categories = await getCachedCategories();
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
