"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function OrderCard({ order }: { order: any }) {
    const [expanded, setExpanded] = useState(false);

    return (
        <Card className="overflow-hidden transition-all duration-300">
            <CardHeader
                className="pb-4 flex flex-row items-center justify-between border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                onClick={() => setExpanded(!expanded)}
            >
                <div>
                    <CardTitle className="text-lg text-emerald-600 dark:text-emerald-400">
                        Order #{order.id.slice(-6).toUpperCase()}
                    </CardTitle>
                    <CardDescription className="mt-1" suppressHydrationWarning>
                        Placed on {new Date(order.createdAt).toLocaleDateString()} • {order.orderItems.length} items
                    </CardDescription>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <div className="font-bold text-lg text-slate-900 dark:text-white">₹{order.total.toFixed(2)}</div>
                        <div className={`text-sm font-bold uppercase tracking-wider ${order.status === 'DELIVERED' ? 'text-emerald-600' : 'text-orange-500'}`}>
                            {order.status}
                        </div>
                    </div>
                    <div className="text-slate-400">
                        {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                </div>
            </CardHeader>

            {expanded && (
                <CardContent className="pt-0 pb-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
                    <div className="divide-y divide-slate-200 dark:divide-slate-800/60 mt-4">
                        {order.orderItems.map((item: any, index: number) => {
                            let imageSrc = null;
                            if (item.product?.images) {
                                try {
                                    const images = JSON.parse(item.product.images);
                                    if (Array.isArray(images) && images.length > 0) {
                                        imageSrc = images[0];
                                    }
                                } catch (e) {
                                    // Ignore parse error
                                }
                            }

                            return (
                                <div key={item.id || index} className="py-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        {imageSrc ? (
                                            <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-white">
                                                <Image src={imageSrc} alt={item.product?.name || "Product"} fill className="object-cover" />
                                            </div>
                                        ) : (
                                            <div className="h-16 w-16 shrink-0 bg-slate-200 dark:bg-slate-800 rounded-lg flex items-center justify-center border border-slate-300 dark:border-slate-700">
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">No Image</span>
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold text-sm line-clamp-2 text-slate-900 dark:text-slate-200">
                                                {item.product?.name || 'Deleted Product'}
                                                {item.weightGrams ? <span className="font-normal text-slate-500 ml-1">({item.weightGrams >= 1000 ? `${item.weightGrams / 1000}kg` : `${item.weightGrams}g`})</span> : null}
                                            </p>
                                            <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-1">
                                                Qty: {item.quantity}  <span className="text-slate-400 mx-1">•</span>  ₹{item.price.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="font-bold text-sm whitespace-nowrap text-slate-900 dark:text-white bg-white dark:bg-slate-800 px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700">
                                        ₹{(item.price * item.quantity).toFixed(2)}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </CardContent>
            )}
        </Card>
    );
}
