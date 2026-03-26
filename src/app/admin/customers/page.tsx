import { Card, CardContent } from "@/components/ui/Card";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    include: {
      orders: true,
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <p className="text-muted-foreground text-slate-500">
            View registered customers across the platform.
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Role</th>
                  <th className="px-6 py-4 font-medium">Joined On</th>
                  <th className="px-6 py-4 font-medium text-center">Total Orders</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No customers found in the database.
                    </td>
                  </tr>
                ) : users.map((u: any) => (
                  <tr key={u.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50">
                    <td className="px-6 py-4 font-medium">{u.name || "N/A"}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</td>
                    <td className="px-6 py-4 text-center font-bold">
                       {u.orders.length}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
