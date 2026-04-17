"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Plus, MapPin, Loader2 } from "lucide-react";

export function AddAddressForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [locating, setLocating] = useState(false);

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser");
            return;
        }
        setLocating(true);
        navigator.geolocation.getCurrentPosition(async (position) => {
            try {
                const { latitude, longitude } = position.coords;
                const mapsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
                
                const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                const data = await res.json();
                
                if (data && data.address) {
                    const streetInput = document.getElementById("street") as HTMLInputElement;
                    const cityInput = document.getElementById("city") as HTMLInputElement;
                    const stateInput = document.getElementById("state") as HTMLInputElement;
                    const zipInput = document.getElementById("zipCode") as HTMLInputElement;
                    const countryInput = document.getElementById("country") as HTMLInputElement;
                    
                    if (streetInput) {
                        const roadName = data.address.road || data.address.suburb || data.address.neighbourhood || "Detected Location";
                        streetInput.value = roadName;
                    }
                    if (cityInput) cityInput.value = data.address.city || data.address.town || data.address.village || cityInput.value;
                    if (stateInput) stateInput.value = data.address.state || stateInput.value;
                    if (zipInput) zipInput.value = data.address.postcode || zipInput.value;
                    if (countryInput) countryInput.value = data.address.country || countryInput.value;
                    
                    const locInput = document.getElementById("locationUrl") as HTMLInputElement;
                    if (locInput) locInput.value = mapsLink;
                } else {
                    const locInput = document.getElementById("locationUrl") as HTMLInputElement;
                    if (locInput) locInput.value = mapsLink;
                }
            } catch (err) {
                setError("Failed to fetch address details automatically.");
            } finally {
                setLocating(false);
            }
        }, () => {
            setLocating(false);
            setError("Could not get your location. Please allow location permissions.");
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const form = e.currentTarget;
        const formData = new FormData(form);

        const data = {
            street: formData.get("street") as string,
            city: formData.get("city") as string,
            state: formData.get("state") as string,
            zipCode: formData.get("zipCode") as string,
            country: formData.get("country") as string,
            locationUrl: formData.get("locationUrl") as string,
            isDefault: formData.get("isDefault") === "on",
        };

        try {
            const res = await fetch("/api/user/addresses", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const result = await res.json();
                throw new Error(result.error || "Failed to add address");
            }

            // Reset form, hide it, and reload page data
            form.reset();
            setIsFormVisible(false);
            router.refresh();
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoading(false);
        }
    };

    if (!isFormVisible) {
        return (
            <div
                className="flex flex-col items-center justify-center p-8 h-full min-h-[300px] cursor-pointer group"
                onClick={() => setIsFormVisible(true)}
            >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                    <Plus className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Add New Address</h3>
                <p className="text-slate-500 dark:text-slate-400 text-center font-light">Click here to register a new shipping destination</p>
            </div>
        );
    }

    return (
        <div className="p-2 animate-in fade-in zoom-in-95 duration-300">
            <CardHeader className="pb-4 pt-6 flex flex-row items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-3 text-slate-900 dark:text-white">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600">
                        <Plus className="w-5 h-5" />
                    </div>
                    Add New Address
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setIsFormVisible(false)} className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                    Cancel
                </Button>
            </CardHeader>
            <CardContent className="pb-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                    {error && <div className="text-red-500 text-sm font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">{error}</div>}

                    <div className="flex gap-2">
                        <Input id="street" name="street" required placeholder="Street Address" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light text-slate-900 dark:text-white placeholder:text-slate-400 focus-visible:ring-emerald-500" />
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={handleGetLocation} 
                            disabled={locating}
                            className="shrink-0 h-12 px-3 rounded-xl border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                            {locating ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <MapPin className="w-5 h-5 text-emerald-600" />}
                        </Button>
                    </div>

                    <div>
                        <Input id="locationUrl" name="locationUrl" placeholder="GPS Location Link (Optional) - Auto-filled by Locate Me" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light text-slate-500 focus-visible:ring-emerald-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input id="city" name="city" required placeholder="City" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light focus-visible:ring-emerald-500" />
                        </div>
                        <div>
                            <Input id="state" name="state" required placeholder="State" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light focus-visible:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Input id="zipCode" name="zipCode" required placeholder="Pincode / ZIP" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light focus-visible:ring-emerald-500" />
                        </div>
                        <div>
                            <Input id="country" name="country" required defaultValue="India" placeholder="Country" className="h-12 bg-white/50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 mx-0 rounded-xl px-4 font-light focus-visible:ring-emerald-500" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2 px-1">
                        <div className="relative flex items-start">
                            <div className="flex h-6 items-center">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    name="isDefault"
                                    className="w-5 h-5 rounded border border-slate-300 dark:border-slate-700 text-emerald-600 focus:ring-emerald-600 dark:bg-slate-800"
                                />
                            </div>
                            <div className="ml-3 text-sm leading-6">
                                <label htmlFor="isDefault" className="font-medium text-slate-700 dark:text-slate-300 cursor-pointer select-none">Set as Default Shipping</label>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2 h-12 rounded-xl bg-black hover:bg-slate-800 dark:bg-white dark:text-black dark:hover:bg-slate-200 font-semibold transition-all hover:scale-[1.02] shadow-md" disabled={loading}>
                        {loading ? "Saving Address..." : "Save Address"}
                    </Button>
                </form>
            </CardContent>
        </div>
    );
}
