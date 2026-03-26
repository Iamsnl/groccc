import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { User, Mail, Shield, Package, MapPin, CalendarDays } from "lucide-react";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";
import { getStoreSettings } from "@/lib/settings";

export default async function ProfileOverviewPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login?callbackUrl=/profile");
  }

  // Fetch real counts and user details
  const [dbUser, ordersCount, addressesCount, storeSettings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, email: true, createdAt: true }
    }),
    prisma.order.count({
      where: { userId: session.user.id }
    }),
    prisma.address.count({
      where: { userId: session.user.id }
    }),
    getStoreSettings()
  ]);

  if (!dbUser) {
    return redirect("/login");
  }

  const storeName = storeSettings.storeName;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Overview</h2>
        <p className="text-muted-foreground text-slate-500">
          Manage your account settings, secure your details, and review your activity.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">Total Orders</CardTitle>
            <Package className="w-4 h-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-300">{ordersCount}</div>
            <p className="text-xs text-emerald-600/70 mt-1">Lifetime grocery orders placed</p>
          </CardContent>
        </Card>
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-400">Saved Addresses</CardTitle>
            <MapPin className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-300">{addressesCount}</div>
            <p className="text-xs text-blue-600/70 mt-1">Shipping locations added</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 dark:bg-purple-900/20 border-purple-100 dark:border-purple-800/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-400">Member Since</CardTitle>
            <CalendarDays className="w-4 h-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-900 dark:text-purple-300 mt-1">
              {new Date(dbUser.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
            </div>
            <p className="text-xs text-purple-600/70 mt-2">Active {storeName} shopper</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Personal Details Column */}
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-600" />
              <CardTitle>Personal Information</CardTitle>
            </div>
            <CardDescription>Your registered account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium text-slate-500 mb-1 block">Full Name</label>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-medium">
                {dbUser.name || "N/A"}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-500 mb-1 block">Email Address</label>
              <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800 font-medium flex items-center justify-between">
                <span>{dbUser.email}</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">Verified</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Column */}
        <Card className="shadow-sm border-orange-100 dark:border-orange-900/50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              <CardTitle>Security & Password</CardTitle>
            </div>
            <CardDescription>Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
