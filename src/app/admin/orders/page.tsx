import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";
import { AdminOrderTable } from "@/components/admin/AdminOrderTable";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: {
      user: true,
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders Registry</h2>
          <p className="text-muted-foreground text-slate-500">
            View all customer orders and update their current status.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <AdminOrderTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}
