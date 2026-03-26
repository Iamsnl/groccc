import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { AddAddressForm } from "@/components/profile/AddAddressForm";
import { MapPin, CheckCircle2, Home } from "lucide-react";

export default async function AddressesPage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
        redirect("/login?callbackUrl=/profile/addresses");
    }

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: { id: "desc" }
    });

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white mb-2">Saved Addresses</h2>
                <p className="text-slate-500 dark:text-slate-400 font-light text-lg">
                    Manage your shipping destinations for faster checkout
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {addresses.map((address) => (
                    <Card key={address.id} className={`group relative overflow-hidden rounded-[2rem] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl bg-white dark:bg-slate-900/40 backdrop-blur-3xl ${address.isDefault ? "border-emerald-500 shadow-emerald-500/10" : "border-slate-200 dark:border-white/10"}`}>

                        {address.isDefault && (
                            <div className="absolute top-0 right-0 p-4 z-10">
                                <CheckCircle2 className="w-6 h-6 text-emerald-500 animate-pulse bg-white dark:bg-slate-900 rounded-full" />
                            </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-transparent dark:from-slate-800/50 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <CardHeader className="pb-2 relative z-10 pt-8 pl-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className={`p-3 rounded-2xl ${address.isDefault ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-100 dark:bg-slate-800 text-slate-500"}`}>
                                    {address.isDefault ? <Home className="w-6 h-6" /> : <MapPin className="w-6 h-6" />}
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-semibold text-slate-900 dark:text-white">
                                        {address.city}
                                    </CardTitle>
                                    {address.isDefault && <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase mt-1 block">Default Shipping</span>}
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="relative z-10 pl-8 pb-8 pt-2">
                            <div className="space-y-1.5 text-slate-600 dark:text-slate-300 font-light text-sm">
                                <p className="font-medium text-slate-900 dark:text-slate-200">{address.street}</p>
                                <p>{address.city}, {address.state} {address.zipCode}</p>
                                <p className="uppercase tracking-widest text-xs font-semibold mt-4 text-slate-400">{address.country}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {/* Add New Address Form Card */}
                <Card className="rounded-[2rem] border-dashed border-2 border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/20 backdrop-blur-xl hover:bg-slate-100 dark:hover:bg-slate-900/50 transition-colors duration-300 flex flex-col justify-center min-h-[300px] overflow-hidden">
                    <AddAddressForm />
                </Card>
            </div>
        </div>
    );
}
