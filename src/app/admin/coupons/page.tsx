import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminCouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Coupons</h2>
          <p className="text-muted-foreground text-slate-500">
            Manage discount codes and promotional offers.
          </p>
        </div>
        <Button>Create Coupon</Button>
      </div>

      <Card>
        <CardContent className="p-12 text-center text-slate-500">
          <p>Coupon management coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
