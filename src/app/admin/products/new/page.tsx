"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [data, setData] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    categoryId: "",
    images: "[]", // Dummy default JSON array string for images
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((catData) => {
        setCategories(catData);
        if (catData.length > 0) {
          setData((prev) => ({ ...prev, categoryId: catData[0].id }));
        }
      })
      .catch(console.error);
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        setData({ ...data, images: JSON.stringify([result.url]) });
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      alert("Error uploading image");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          categoryId: data.categoryId,
          isFeatured: false,
          isTrending: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      alert("Error adding product");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">Add New Product</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Product Name</label>
                <Input 
                  required 
                  placeholder="Organic Apples"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Slug</label>
                <Input 
                  required 
                  placeholder="organic-apples"
                  value={data.slug}
                  onChange={(e) => setData({ ...data, slug: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-medium">Description</label>
                <Input 
                  required 
                  placeholder="Fresh from the farm..."
                  value={data.description}
                  onChange={(e) => setData({ ...data, description: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Price (₹)</label>
                <Input 
                  required 
                  type="number"
                  step="0.01"
                  placeholder="4.99"
                  value={data.price}
                  onChange={(e) => setData({ ...data, price: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Discount Price (₹) (Optional)</label>
                <Input 
                  type="number"
                  step="0.01"
                  placeholder="3.99"
                  value={data.discountPrice}
                  onChange={(e) => setData({ ...data, discountPrice: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Stock</label>
                <Input 
                  required 
                  type="number"
                  placeholder="100"
                  value={data.stock}
                  onChange={(e) => setData({ ...data, stock: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Category</label>
                <select 
                  required
                  className="flex h-10 w-full rounded-md border border-slate-300 bg-transparent px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:focus:ring-emerald-500"
                  value={data.categoryId}
                  onChange={(e) => setData({ ...data, categoryId: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <label className="text-sm font-medium">Product Image</label>
                <Input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
                {uploadingImage && <p className="text-sm text-emerald-600">Uploading...</p>}
                {data.images !== "[]" && JSON.parse(data.images)[0] && (
                  <img src={JSON.parse(data.images)[0]} alt="Preview" className="h-20 w-20 object-cover mt-2 rounded" />
                )}
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-2 border-t mt-6 border-slate-100 dark:border-slate-800">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2" disabled={loading}>
                <Save className="w-4 h-4" /> 
                {loading ? "Saving..." : "Save Product"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
