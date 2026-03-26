"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function AdminOrderTable({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => setExpandedOrderId(expandedOrderId === id ? null : id);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus })
      });

      if (!res.ok) throw new Error("Update failed");
      router.refresh();
    } catch (error) {
      alert("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <tr>
            <th className="px-6 py-4 font-medium">Order ID</th>
            <th className="px-6 py-4 font-medium">Customer</th>
            <th className="px-6 py-4 font-medium">Date</th>
            <th className="px-6 py-4 font-medium">Items</th>
            <th className="px-6 py-4 font-medium text-right">Total</th>
            <th className="px-6 py-4 font-medium text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                No orders found in the database.
              </td>
            </tr>
          ) : orders.map((order: any) => (
            <React.Fragment key={order.id}>
              <tr
                className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 cursor-pointer transition-colors"
                onClick={() => toggleExpand(order.id)}
              >
                <td className="px-6 py-4 font-medium">#{order.id.slice(-6).toUpperCase()}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{order.user?.name || "Guest"}</td>
                <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                <td className="px-6 py-4">{order.orderItems?.length || 0}</td>
                <td className="px-6 py-4 text-right font-bold text-emerald-600">₹{order.total.toFixed(2)}</td>
                <td className="px-6 py-4 text-center">
                  <select
                    disabled={updatingId === order.id}
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold w-full cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 
                      ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                      }`}
                  >
                    <option value="PENDING" className="bg-white text-slate-900">PENDING</option>
                    <option value="PROCESSING" className="bg-white text-slate-900">PROCESSING</option>
                    <option value="SHIPPED" className="bg-white text-slate-900">SHIPPED</option>
                    <option value="DELIVERED" className="bg-white text-slate-900">DELIVERED</option>
                    <option value="CANCELLED" className="bg-white text-slate-900">CANCELLED</option>
                  </select>
                </td>
              </tr>
              {expandedOrderId === order.id && (
                <tr className="bg-slate-50/80 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-800 w-full shadow-inner animate-in slide-in-from-top-2 duration-200 fade-in">
                  <td colSpan={6} className="px-6 py-6 border-l-4 border-l-emerald-500">
                    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800 shadow-sm max-w-4xl mx-auto">
                      <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 font-semibold text-sm text-slate-700 dark:text-slate-300">
                        Products in Order #{order.id.slice(-6).toUpperCase()}
                      </div>
                      <div className="max-h-[400px] overflow-y-auto">
                        {order.orderItems?.map((item: any, index: number) => {
                          let imageSrc = null;
                          if (item.product?.images) {
                            try {
                              const parsed = JSON.parse(item.product.images);
                              if (Array.isArray(parsed) && parsed.length > 0) imageSrc = parsed[0];
                            } catch (e) { }
                          }

                          return (
                            <div key={item.id || index} className="p-4 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors">
                              <div className="flex items-center gap-4">
                                {imageSrc ? (
                                  <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 border overflow-hidden relative shrink-0 shadow-sm">
                                    <Image src={imageSrc} alt={item.product?.name || "Product"} fill className="object-cover" />
                                  </div>
                                ) : (
                                  <div className="h-14 w-14 rounded-lg bg-slate-100 dark:bg-slate-800 border flex items-center justify-center shrink-0">
                                    <span className="text-[10px] text-slate-400 font-medium">No Image</span>
                                  </div>
                                )}
                                <div>
                                  <p className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1">{item.product?.name || "Unknown Product"}</p>
                                  <p className="text-xs text-slate-500 mt-1">Qty: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                                </div>
                              </div>
                              <div className="font-bold text-sm text-slate-700 dark:text-slate-200">
                                ₹{(item.quantity * item.price).toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-900 px-5 py-3 flex justify-between items-center text-sm border-t border-slate-200 dark:border-slate-800">
                        <span className="font-medium text-slate-600 dark:text-slate-400">Order Total</span>
                        <span className="font-bold text-lg text-emerald-600">₹{order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
