import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { AddToCartButton } from "@/components/shop/AddToCartButton";
import { prisma } from "@/lib/prisma";
import { getStoreSettings } from "@/lib/settings";

export default async function Home() {
  const categories = [
    { name: "Fruits & Vegetables", slug: "fruits-and-vegetables", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop" },
    { name: "Dairy & Bakery", slug: "dairy-and-bakery", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=300&fit=crop" },
    { name: "Snacks", slug: "snacks", image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=300&h=300&fit=crop" },
    { name: "Beverages", slug: "beverages", image: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=300&h=300&fit=crop" },
  ];

  const storeName = (await getStoreSettings()).storeName;

  const dbProducts = await prisma.product.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const featured = dbProducts.length > 0 ? dbProducts.map((p: any) => {
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
      rating: 4.8,
    };
  }) : [
    { id: "1", name: "Fresh Red Apple (1kg)", price: 4.99, discount: 3.99, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6fd6c?w=400&h=400&fit=crop", rating: 4.8 },
    { id: "2", name: "Organic Bananas", price: 2.99, discount: null, image: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4?w=400&h=400&fit=crop", rating: 4.5 },
    { id: "3", name: "Whole Milk (1 Gallon)", price: 5.49, discount: null, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop", rating: 4.9 },
    { id: "4", name: "Farm Fresh Eggs", price: 3.99, discount: 2.99, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=400&fit=crop", rating: 4.7 },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative w-full h-[600px] md:h-[750px] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=2000"
          alt="Fresh Groceries"
          fill
          className="object-cover scale-105 animate-gradient-x opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-slate-900/80 to-black/90" />

        {/* Animated Background Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full mix-blend-screen filter blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-teal-500/20 rounded-full mix-blend-screen filter blur-[120px] animate-float-delayed" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 z-10 flex flex-col items-center mt-12">
            <div className="bg-black/50 backdrop-blur-3xl p-10 md:p-16 rounded-[2.5rem] max-w-4xl w-full text-center border border-white/10 shadow-2xl">
              <div className="inline-block px-6 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold tracking-[0.2em] text-emerald-300 uppercase mb-8">
                Next-Gen Grocery Experience
              </div>
              <h1 className="text-5xl md:text-7xl font-sans font-medium tracking-tight text-white leading-tight mb-6 drop-shadow-md">
                Fresh Groceries. <br />
                <span className="text-emerald-400 font-semibold">Delivered Fast.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
                Get farm-fresh produce, dairy, and household essentials delivered right to your door with unprecedented convenience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white hover:bg-slate-100 text-black font-semibold border-none h-14 px-8 rounded-full transition-all transform hover:scale-105">
                  Shop Now <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-white border-white/20 hover:bg-white/10 transition-all transform hover:scale-105">
                  View Special Offers
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 mt-8 md:mt-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Shop by Category</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-light">Explore our premium variety of fresh products</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="group relative overflow-hidden rounded-[2rem] aspect-[4/5] shadow-lg transition-all duration-500 hover:-translate-y-2">
              <Image src={c.image} alt={c.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 transition-opacity duration-500" />
              <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                <h3 className="text-2xl font-semibold text-white mb-2">{c.name}</h3>
                <span className="text-sm font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity delay-100 flex items-center">Explore <ArrowRight className="w-4 h-4 ml-1 inline" /></span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4 mt-12 md:mt-32">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-semibold tracking-tight text-slate-900 dark:text-white">Featured Deals</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg font-light">Hand-picked premium products curated for you</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {featured.map((p: any) => (
            <Card key={p.id} className="group overflow-hidden rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white dark:bg-slate-900 relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 dark:bg-slate-800 p-4 rounded-t-[2rem]">
                {p.discount && (
                  <div className="absolute top-4 left-4 z-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold tracking-widest px-4 py-1.5 rounded-full shadow-md">
                    SALE
                  </div>
                )}
                <Image src={p.image} alt={p.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
              </div>
              <CardContent className="relative z-10 p-6 bg-white dark:bg-slate-900">
                <Link href={`/product/${p.id}`} className="block mb-2">
                  <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                    {p.name}
                  </h3>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="font-semibold text-2xl text-slate-900 dark:text-white">
                      ₹{p.discount ?? p.price}
                    </span>
                    {p.discount && (
                      <span className="text-sm text-slate-500 line-through">₹{p.price}</span>
                    )}
                  </div>
                  <div className="transform transition-transform">
                    <AddToCartButton product={{
                      id: p.id,
                      name: p.name,
                      price: p.price,
                      discountPrice: p.discount,
                      image: p.image,
                    }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* App Promo */}
      <section className="container mx-auto px-4 mt-20 md:mt-32 pb-10">
        <div className="relative overflow-hidden rounded-[3rem] p-10 md:p-20 shadow-2xl bg-slate-950 border border-slate-800">
          <div className="absolute top-0 right-0 w-full md:w-1/2 h-full opacity-60 mix-blend-luminosity">
            <Image src="https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=1000" alt="App Promo" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent md:bg-gradient-to-r md:from-slate-950 md:via-slate-950/80 md:to-transparent" />
          </div>
          <div className="relative z-10 w-full md:w-1/2">
            <div className="inline-block px-5 py-2 rounded-full border border-white/20 bg-white/5 text-slate-300 text-xs font-bold tracking-widest uppercase mb-6">
              Mobile Convenience
            </div>
            <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-6 leading-tight">
              Download the {storeName} App
            </h2>
            <p className="text-slate-400 text-lg md:text-xl font-light mb-10 leading-relaxed max-w-lg">
              Unlock exclusive app-only discounts, track couriers in real-time, and perfectly manage your household essentials with a single tap.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white hover:bg-slate-200 text-black font-semibold rounded-2xl h-16 px-8 transition-all hover:scale-105">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M17.431 16.57c.026.008 2.768 1.054 2.802 4.145-2.222 3.12-4.542 3.129-5.3 3.16-2.17.067-2.8-.973-4.992-.973-2.193 0-3.048.973-4.993.973-1.026 0-3.69-.324-6.071-3.793-2.522-3.673-3.655-9.28-1.543-12.946C3.411 5.345 5.253 4.103 7.025 4.072 9.074 4.04 10.51 5.4 11.66 5.4c1.152 0 3.03-1.637 5.48-1.42 1.022.046 3.93.385 5.8 3.102-4.665 2.502-3.804 9.17-5.509 9.488zm-3.896-10.46c.995-1.192 1.66-2.85 1.48-4.51-1.41.055-3.15.93-4.17 2.12-.91.1-1.66 2.78-1.44 4.38 1.54.12 3.12-.8 4.13-1.99z" /></svg>
                App Store
              </Button>
              <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white font-semibold rounded-2xl h-16 px-8 border border-white/20 backdrop-blur-md transition-all hover:scale-105">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24"><path d="M3.609 1.814L13.792 12 3.61 22.186C3.469 22.036 3.398 21.848 3.398 21.611V2.389c0-.237.071-.425.211-.575zM14.774 11.018l4.449-4.568-15.02-8.583 10.571 13.151zM15.549 12.518L4.203 24.133l15.02-8.582-3.674-3.033zM21.196 15.688l-4.482-2.57 3.525-4.55c.343.344.514.735.514 1.173v4.774c0 .438-.171.829-.514 1.173h-.043z" /></svg>
                Google Play
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
