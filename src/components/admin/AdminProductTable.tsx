"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Edit2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminProductTable({ products }: { products: any[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setDeletingId(id);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      router.refresh();
    } catch (error) {
      alert("Failed to delete product.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 font-medium">Product Name</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium">Stock</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p: any) => (
            <tr key={p.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
              <td className="px-6 py-4 font-medium">{p.name}</td>
              <td className="px-6 py-4 text-slate-500">{p.category?.name || "Uncategorized"}</td>
              <td className="px-6 py-4">₹{p.price.toFixed(2)}</td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 20 ? 'bg-emerald-100 text-emerald-700' : p.stock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-emerald-600"
                    onClick={() => router.push(`/admin/products/${p.id}/edit`)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-slate-500 hover:text-red-500"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && (
        <div className="p-8 text-center text-slate-500">
          No products found. Add a new product to get started.
        </div>
      )}
    </div>
  );
}
