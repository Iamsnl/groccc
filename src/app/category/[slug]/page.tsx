import Image from "next/image";
import Link from "next/link";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { AddToCartButton } from "@/components/shop/AddToCartButton";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug;
  const dbCategory = await prisma.category.findUnique({ where: { slug } });

  const dbProducts = await prisma.product.findMany({
    where: { category: { slug } },
    orderBy: { createdAt: "desc" }
  });

  const products = dbProducts.length > 0 ? dbProducts.map((p: any) => {
    let image = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop";
    try {
      if (p.images) {
        const parsed = JSON.parse(p.images);
        if (Array.isArray(parsed) && parsed.length > 0) image = parsed[0];
      }
    } catch {
      if (p.images && p.images.length > 5) image = p.images;
    }
    return {
      id: p.id,
      name: p.name,
      price: p.price,
      discount: p.discountPrice,
      image,
      rating: 4.8 // Fixed rating for now
    };
  }) : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight capitalize">{dbCategory?.name || slug.replace(/-/g, ' ')}</h1>
        <p className="text-slate-500 mt-2">{dbCategory?.description || `Find the best items in ${slug.replace(/-/g, ' ')}`}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full md:w-64 shrink-0">
          <Card>
            <CardContent className="p-4 space-y-6">
              <div className="flex items-center gap-2 font-semibold pb-4 border-b">
                <Filter className="w-4 h-4" /> Filters
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> Under ₹500</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> ₹500 to ₹1000</label>
                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="rounded" /> Over ₹1000</label>
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-24 text-slate-500">No products found for this category.</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {products.map((p: any) => (
                <Card key={p.id} className="group overflow-hidden rounded-2xl border-slate-200/60 transition-all hover:shadow-xl hover:border-emerald-200 dark:border-slate-800 dark:hover:border-emerald-900">
                  <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-900 p-4">
                    {p.discount && (
                      <div className="absolute top-3 left-3 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                        SALE
                      </div>
                    )}
                    <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105 mix-blend-multiply dark:mix-blend-normal" />
                  </div>
                  <CardContent className="p-4 md:p-5">

                    <Link href={`/product/${p.id}`} className="block">
                      <h3 className="font-semibold text-base md:text-lg line-clamp-1 group-hover:text-emerald-600 transition-colors">
                        {p.name}
                      </h3>
                    </Link>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-slate-900 dark:text-white">
                          ₹{p.discount ?? p.price}
                        </span>
                        {p.discount && (
                          <span className="text-sm text-slate-400 line-through">₹{p.price}</span>
                        )}
                      </div>
                      <AddToCartButton product={{
                        id: p.id,
                        name: p.name,
                        price: p.price,
                        discountPrice: p.discount,
                        image: p.image,
                      }} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
