"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, CheckCircle2, Banknote, Wallet, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/useCartStore";
import { Input } from "@/components/ui/Input";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new");
  const [fetchingAddresses, setFetchingAddresses] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    street: "",
    city: "",
    zipCode: ""
  });

  const subtotal = totalPrice();
  const deliveryInfo = subtotal > 99 ? 0 : 5.99;
  const finalTotal = subtotal + deliveryInfo;

  useEffect(() => {
    fetch("/api/addresses")
      .then(res => {
        if (res.ok) return res.json();
        return [];
      })
      .then(data => {
        setAddresses(data);
        if (data.length > 0) {
          setSelectedAddressId(data[0].id);
        }
        setFetchingAddresses(false);
      })
      .catch((e) => {
        console.error("Error fetching addresses", e);
        setFetchingAddresses(false);
      });
  }, []);

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAddressId === "new" || addresses.length === 0) {
      setLoading(true);
      try {
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            street: formData.street,
            city: formData.city,
            state: "NA",
            zipCode: formData.zipCode,
            country: "NA"
          })
        });
        if (res.ok) {
          const newAddr = await res.json();
          setAddresses([...addresses, newAddr]);
          setSelectedAddressId(newAddr.id);
        } else {
          if (res.status === 401) {
            router.push("/login?callbackUrl=/checkout");
            return;
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    setStep(2);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const selectedAddress = addresses.find(a => a.id === selectedAddressId);
    const addressString = selectedAddress
      ? `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zipCode}`
      : "Saved Address";

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          total: finalTotal,
          address: addressString,
          paymentMethod: "COD"
        })
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/login?callbackUrl=/checkout");
          return;
        }
        throw new Error("Failed to place order.");
      }

      clearCart();
      router.push("/success");
    } catch (error) {
      alert("Checkout failed. Your cart contained invalid or outdated items. We've cleared your cart, please rebuild your order with live products.");
      clearCart();
      router.push("/cart");
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step === 1) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8 text-center bg-gradient-to-r from-emerald-600 to-green-400 bg-clip-text text-transparent">
          Secure Checkout
        </h1>

        <div className="flex items-center justify-center mb-12">
          <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step >= 1 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>1</span>
            <span className="font-medium hidden sm:block">Delivery</span>
          </div>
          <div className={`h-1 w-16 mx-4 rounded-full ${step >= 2 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-800'}`} />
          <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-emerald-600' : 'text-slate-400'}`}>
            <span className={`w-8 h-8 flex items-center justify-center rounded-full font-bold ${step >= 2 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-slate-100 dark:bg-slate-800'}`}>2</span>
            <span className="font-medium hidden sm:block">Payment</span>
          </div>
        </div>

        <form onSubmit={step === 1 ? handleNextStep : handleCheckout}>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-10 shadow-sm border border-slate-200 dark:border-slate-800">
            {step === 1 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                    <Truck className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Shipping Address</h2>
                </div>

                {fetchingAddresses ? (
                  <p className="text-sm text-slate-500 mb-6">Loading saved addresses...</p>
                ) : addresses.length > 0 ? (
                  <div className="space-y-4 mb-6">
                    <p className="font-medium">Select a saved address:</p>
                    {addresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => setSelectedAddressId(addr.id)}
                        className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === addr.id ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-800'}`}
                      >
                        <p className="font-semibold">{addr.street}</p>
                        <p className="text-sm text-slate-500">{addr.city}, {addr.state} {addr.zipCode}</p>
                      </div>
                    ))}
                    <div
                      onClick={() => setSelectedAddressId("new")}
                      className={`p-4 border rounded-xl cursor-pointer transition-colors ${selectedAddressId === "new" ? 'border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-800'}`}
                    >
                      <p className="font-semibold text-emerald-600">+ Add New Address</p>
                    </div>
                  </div>
                ) : null}

                {(addresses.length === 0 || selectedAddressId === "new") && !fetchingAddresses && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium">First Name</label>
                      <Input required value={formData.firstName} onChange={e => setFormData({ ...formData, firstName: e.target.value })} placeholder="John" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium">Last Name</label>
                      <Input required value={formData.lastName} onChange={e => setFormData({ ...formData, lastName: e.target.value })} placeholder="Doe" />
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input required value={formData.street} onChange={e => setFormData({ ...formData, street: e.target.value })} placeholder="123 Shopping Avenue" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium">City</label>
                      <Input required value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} placeholder="New York" />
                    </div>
                    <div className="space-y-2 col-span-2 sm:col-span-1">
                      <label className="text-sm font-medium">ZIP Code</label>
                      <Input required value={formData.zipCode} onChange={e => setFormData({ ...formData, zipCode: e.target.value })} placeholder="10001" />
                    </div>
                  </div>
                )}

                <div className="pt-6">
                  <Button type="submit" size="lg" className="w-full h-14 text-lg">
                    Continue to Payment
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div className="p-3 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold">Payment Details</h2>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-950/50 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8">
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
                    <span className="text-slate-500">Delivery</span>
                    <span className="font-semibold">{deliveryInfo === 0 ? "Free" : `₹${deliveryInfo.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total to Pay</span>
                    <span className="text-emerald-600">₹{finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl flex items-center justify-between cursor-pointer transition-colors shadow-sm">
                    <div className="flex items-center gap-3">
                      <input type="radio" checked readOnly className="w-5 h-5 text-emerald-600 focus:ring-emerald-500" />
                      <div className="flex items-center gap-2">
                        <Banknote className="w-5 h-5 text-emerald-600" />
                        <span className="font-semibold text-emerald-800 dark:text-emerald-400">Cash on Delivery (COD)</span>
                      </div>
                    </div>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <input type="radio" disabled className="w-5 h-5" />
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-600 dark:text-slate-400">UPI</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Coming Soon</span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <input type="radio" disabled className="w-5 h-5" />
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-600 dark:text-slate-400">Debit / Credit Card</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Coming Soon</span>
                  </div>

                  <div className="border border-slate-200 dark:border-slate-800 p-4 rounded-xl flex items-center justify-between opacity-50 cursor-not-allowed bg-slate-50 dark:bg-slate-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <input type="radio" disabled className="w-5 h-5" />
                      <div className="flex items-center gap-2">
                        <Wallet className="w-5 h-5 text-slate-500" />
                        <span className="font-medium text-slate-600 dark:text-slate-400">Wallets</span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-slate-500">Coming Soon</span>
                  </div>
                </div>

                <div className="flex gap-4 pt-6">
                  <Button type="button" variant="outline" size="lg" className="w-1/3 h-14" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" size="lg" className="w-2/3 h-14 text-lg bg-emerald-600 shadow-xl shadow-emerald-600/20" disabled={loading}>
                    {loading ? "Processing..." : `Place Order (COD)`}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          Your payment is encrypted and 100% secure.
        </div>
      </div>
    </div>
  );
}
