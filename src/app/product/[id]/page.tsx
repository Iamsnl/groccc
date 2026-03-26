import Image from "next/image";
import Link from "next/link";
import { Truck, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { prisma } from "@/lib/prisma";
import { ProductActionButtons } from "@/components/shop/ProductActionButtons";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const dbProduct = await prisma.product.findUnique({
    where: { id },
    include: { category: true }
  });

  if (!dbProduct) {
    return notFound();
  }

  let imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&h=800&fit=crop";
  try {
    if (dbProduct.images) {
      const parsed = JSON.parse(dbProduct.images);
      if (Array.isArray(parsed) && parsed.length > 0) imageUrl = parsed[0];
    }
  } catch {
    if (dbProduct.images && dbProduct.images.length > 5) imageUrl = dbProduct.images;
  }

  const currentPrice = dbProduct.discountPrice ?? dbProduct.price;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/">
        <Button variant="ghost" className="mb-6 -ml-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </Link>

      <div className="flex flex-col md:flex-row gap-12 bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-12 shadow-sm border border-slate-100 dark:border-slate-800">
        {/* Product Image */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
            {dbProduct.discountPrice && (
              <div className="absolute top-4 left-4 z-10 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-md">
                SALE
              </div>
            )}
            <Image src={imageUrl} alt={dbProduct.name} fill className="object-cover mix-blend-multiply dark:mix-blend-normal" />
          </div>
        </div>

        {/* Product Info */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">


          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{dbProduct.name}</h1>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-4xl font-black text-slate-900 dark:text-white">₹{currentPrice.toFixed(2)}</span>
            {dbProduct.discountPrice && (
              <span className="text-2xl text-slate-400 line-through">₹{dbProduct.price.toFixed(2)}</span>
            )}
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-1 rounded-md ml-auto">
              {dbProduct.stock > 0 ? "IN STOCK" : "OUT OF STOCK"}
            </span>
          </div>

          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            {dbProduct.description}
          </p>

          <ProductActionButtons product={{
            id: dbProduct.id,
            name: dbProduct.name,
            price: dbProduct.price,
            discountPrice: dbProduct.discountPrice,
            image: imageUrl,
            stock: dbProduct.stock,
          }} />

          <div className="space-y-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <Truck className="w-5 h-5 text-emerald-500" />
              <span>Free delivery on orders over ₹500</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-500" />
              <span>100% Satisfaction Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
