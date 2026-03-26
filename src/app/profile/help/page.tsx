"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent } from "@/components/ui/Card";
import { LifeBuoy, Plus, MessageSquare } from "lucide-react";

export default function HelpPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    const loadTickets = async () => {
        try {
            const res = await fetch("/api/support");
            const data = await res.json();
            if (res.ok) setTickets(data);
        } catch (e) { }
        setLoading(false);
    };

    useEffect(() => { loadTickets(); }, []);

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!subject || !message) return;
        try {
            const res = await fetch("/api/support", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, message })
            });
            if (res.ok) {
                setSubject("");
                setMessage("");
                setShowForm(false);
                loadTickets();
            }
        } catch (e) { }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Support Requests</h2>
                    <p className="text-slate-500">Need help? Raise a request and we'll get back to you.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    <Plus className="w-4 h-4 mr-2" /> New Request
                </Button>
            </div>

            {showForm && (
                <Card className="border-emerald-100 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10 shadow-md">
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="text-sm font-medium mb-1 block">Subject</label>
                                <Input value={subject} onChange={e => setSubject(e.target.value)} required placeholder="What do you need help with?" />
                            </div>
                            <div>
                                <label className="text-sm font-medium mb-1 block">Message</label>
                                <textarea
                                    className="w-full h-32 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                                    value={message} onChange={e => setMessage(e.target.value)} required placeholder="Describe your issue in detail..."
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                                <Button type="submit">Submit Request</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {loading ? (
                <p className="text-slate-500">Loading support history...</p>
            ) : tickets.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <LifeBuoy className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="font-semibold text-lg">No support requests</h3>
                    <p className="text-slate-500">You haven't opened any support tickets yet.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {tickets.map((t: any) => (
                        <Link key={t.id} href={`/profile/help/${t.id}`} className="block">
                            <Card className="hover:border-emerald-500 transition-colors cursor-pointer shadow-sm">
                                <CardContent className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full">
                                            <MessageSquare className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{t.subject}</h4>
                                            <p className="text-xs text-slate-500">
                                                {new Date(t.createdAt).toLocaleDateString()} • Ticket #{t.id.slice(-6).toUpperCase()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${t.status === 'RESOLVED' ? 'bg-slate-100 text-slate-500' : 'bg-orange-100 text-orange-700 border border-orange-200'
                                            }`}>
                                            {t.status}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
