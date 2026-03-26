"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { MessageSquare, Clock } from "lucide-react";

export default function AdminSupportPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/support")
            .then(res => res.json())
            .then(data => { setTickets(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-slate-500">Loading support queue...</div>;

    const openTickets = tickets.filter((t: any) => t.status === "OPEN");
    const resolvedTickets = tickets.filter((t: any) => t.status === "RESOLVED");

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Customer Support</h1>
                <div className="text-sm font-medium bg-orange-100 text-orange-700 px-3 py-1 rounded-full">
                    {openTickets.length} Open Requests
                </div>
            </div>

            <div className="grid gap-6">
                <div>
                    <h2 className="font-semibold text-lg mb-3 flex items-center gap-2">
                        <Clock className="w-5 h-5 text-orange-500" /> Action Required
                    </h2>
                    {openTickets.length === 0 ? (
                        <div className="p-6 bg-slate-50 dark:bg-slate-900 rounded-xl text-center text-slate-500 border border-slate-100 dark:border-slate-800">
                            Hooray! Inbox zero. All customer requests handled.
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {openTickets.map((t: any) => (
                                <Link key={t.id} href={`/admin/support/${t.id}`}>
                                    <Card className="hover:border-emerald-500 cursor-pointer shadow-sm border-orange-200">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-orange-100 rounded-full">
                                                    <MessageSquare className="w-5 h-5 text-orange-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{t.subject}</h4>
                                                    <p className="text-xs text-slate-500">
                                                        Requested by {t.user?.name || t.user?.email || "Unknown"} • {new Date(t.createdAt).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="font-semibold text-lg mb-3 text-slate-400">Resolved Archive</h2>
                    <div className="grid gap-3">
                        {resolvedTickets.map((t: any) => (
                            <Link key={t.id} href={`/admin/support/${t.id}`}>
                                <Card className="hover:border-slate-400 cursor-pointer opacity-70">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-slate-100 rounded-full dark:bg-slate-800">
                                                <MessageSquare className="w-5 h-5 text-slate-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold">{t.subject}</h4>
                                                <p className="text-xs text-slate-500">
                                                    {t.user?.name || "User"} • #{t.id.slice(-6).toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
