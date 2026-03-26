import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import Image from "next/image";
import { OrderCard } from "@/components/profile/OrderCard";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    redirect("/login?callbackUrl=/profile/orders");
  }

  const dbOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      orderItems: {
        include: {
          product: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Order History</h2>
        <p className="text-muted-foreground text-slate-500">
          View your past orders and their status.
        </p>
      </div>

      {dbOrders.length === 0 ? (
        <Card className="p-12 text-center text-slate-500">
          <p className="mb-4">You have not placed any orders yet.</p>
          <Link href="/">
            <Button>Start Shopping</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {dbOrders.map((order: any) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
