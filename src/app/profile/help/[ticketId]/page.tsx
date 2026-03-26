"use client";
import { useState, useEffect, useRef, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Send, ArrowLeft, UserCircle, ShieldCheck } from "lucide-react";
import { useSession } from "next-auth/react";

export default function TicketDetail({ params }: { params: Promise<{ ticketId: string }> }) {
    const { ticketId } = use(params);
    const router = useRouter();
    const { data: session } = useSession();
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [reply, setReply] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loadTicket = async () => {
        try {
            const res = await fetch(`/api/support/${ticketId}`);
            if (res.ok) {
                const data = await res.json();
                setTicket(data);
                setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
            } else {
                router.push("/profile/help");
            }
        } catch (e) { }
        setLoading(false);
    };

    useEffect(() => { loadTicket(); }, [ticketId]);

    const handleReply = async (e: any) => {
        e.preventDefault();
        if (!reply) return;
        try {
            const res = await fetch(`/api/support/${ticketId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: reply })
            });
            if (res.ok) {
                setReply("");
                loadTicket();
            }
        } catch (e) { }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading ticket details...</div>;
    if (!ticket) return null;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={() => router.push("/profile/help")}>
                    <ArrowLeft className="w-4 h-4" />
                </Button>
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{ticket.subject}</h2>
                    <p className="text-sm text-slate-500">Ticket #{ticket.id.slice(-6).toUpperCase()} • {ticket.status}</p>
                </div>
            </div>

            <Card className="flex flex-col h-[65vh] min-h-[500px] border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50 dark:bg-slate-900/20">
                    {ticket.messages?.map((msg: any) => {
                        const isAdmin = msg.sender?.role === "ADMIN";
                        const isMe = session?.user?.email ? msg.sender?.email === session.user.email : !isAdmin;

                        return (
                            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm ${isMe ? 'bg-emerald-600 text-white rounded-br-none'
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-bl-none'
                                    }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {isAdmin ? <ShieldCheck className={`w-4 h-4 ${isMe ? 'text-emerald-200' : 'text-emerald-600'}`} />
                                            : <UserCircle className={`w-4 h-4 ${isMe ? 'text-emerald-200' : 'text-slate-500'}`} />}
                                        <span className={`text-xs font-semibold ${isMe ? 'text-emerald-100' : 'text-slate-700 dark:text-slate-300'}`}>
                                            {isAdmin ? 'Store Support' : msg.sender?.name || "User"}
                                        </span>
                                        <span className={`text-xs ml-auto ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={`whitespace-pre-wrap text-sm leading-relaxed ${isMe ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 rounded-b-xl z-10">
                    {ticket.status === 'RESOLVED' ? (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-slate-500 text-sm gap-4 border border-slate-100 dark:border-slate-800">
                            <span className="font-medium text-center sm:text-left">This ticket has been marked as resolved by support. Need more help?</span>
                            <Button variant="outline" size="sm" onClick={() => setReply("I need more help with this.")}>Reopen Ticket</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleReply} className="flex gap-2">
                            <Input
                                value={reply}
                                onChange={e => setReply(e.target.value)}
                                placeholder="Type your reply to support..."
                                className="flex-1 focus-visible:ring-emerald-500 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-inner"
                            />
                            <Button type="submit" disabled={!reply.trim()} className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0 shadow-lg shadow-emerald-600/20">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    )}
                </div>
            </Card>
        </div>
    );
}
