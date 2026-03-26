"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Save, Tag } from "lucide-react";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => { if (data?.storeName) setStoreName(data.storeName); });
  }, []);

  const handleSave = async (e: any) => {
    e.preventDefault();
    if (!storeName) return;
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ storeName })
      });
      // Force a full browser reload so Server Components pick up the new name globally
      window.location.reload();
    } catch (e) { }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground text-slate-500">
            Platform configuration and preferences.
          </p>
        </div>
      </div>

      <Card className="max-w-2xl border-emerald-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Tag className="w-5 h-5 text-emerald-600" /> White-Label Branding</CardTitle>
          <CardDescription>Update your store's global name anywhere it appears.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="text-sm font-semibold block mb-1">Store Name</label>
              <Input
                value={storeName}
                onChange={e => setStoreName(e.target.value)}
                placeholder="e.g. FreshCart"
                required
                className="max-w-md"
              />
            </div>
            <Button type="submit" disabled={saving || !storeName} className="bg-emerald-600 hover:bg-emerald-700">
              {saving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
