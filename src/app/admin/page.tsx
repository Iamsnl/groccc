import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { DollarSign, Users, ShoppingBag, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const [totalOrders, recentOrders, totalProducts, totalCategories] = await Promise.all([
    prisma.order.count(),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" }, include: { user: true } }),
    prisma.product.count(),
    prisma.category.count(),
  ]);

  const stats = [
    { title: "Total Users", value: "3", icon: <Users className="w-5 h-5 text-emerald-500" />, change: "Active across platform" },
    { title: "Total Orders", value: totalOrders.toString(), icon: <ShoppingBag className="w-5 h-5 text-emerald-500" />, change: "Lifetime orders" },
    { title: "Total Products", value: totalProducts.toString(), icon: <TrendingUp className="w-5 h-5 text-emerald-500" />, change: `In ${totalCategories} categories` },
    { title: "Platform Health", value: "100%", icon: <DollarSign className="w-5 h-5 text-emerald-500" />, change: "All systems operational" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">{stat.title}</CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-emerald-600 mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Sales Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full flex items-end justify-between bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
               {/* Dummy Chart Visualization */}
               {[40, 70, 45, 90, 65, 85, 120].map((h, i) => (
                 <div key={i} className="w-[10%] bg-emerald-500 rounded-t-md hover:bg-emerald-400 transition-colors" style={{ height: `${h}%` }}></div>
               ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest transactions from store.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.length === 0 ? (
                <p className="text-sm text-slate-500 p-4 text-center">No recent orders found.</p>
              ) : recentOrders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 last:border-0 pb-4 last:pb-0">
                  <div>
                    <p className="text-sm font-medium">#{order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-slate-500">
                      {order.user?.name || "Guest"} • {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-sm font-bold text-emerald-600">₹{order.total.toFixed(2)}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
