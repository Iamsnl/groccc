"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { CheckCircle2 } from "lucide-react";

export function ChangePasswordForm() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess(false);

        const formData = new FormData(e.currentTarget);
        const currentPassword = formData.get("currentPassword") as string;
        const newPassword = formData.get("newPassword") as string;
        const confirmPassword = formData.get("confirmPassword") as string;

        if (newPassword !== confirmPassword) {
            setError("New passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/user/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Failed to update password");
            }

            setSuccess(true);
            (e.target as HTMLFormElement).reset();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3" />
                <h3 className="font-bold text-lg">Password Updated</h3>
                <p className="text-slate-500 text-sm mt-1 mb-4">Your password has been securely changed and saved.</p>
                <Button variant="outline" onClick={() => setSuccess(false)}>Update Again</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/50 p-3 rounded-lg border border-red-100 dark:border-red-900">{error}</div>}

            <div>
                <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Current Password</label>
                <Input name="currentPassword" type="password" required placeholder="Enter current password" />
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">New Password</label>
                <Input name="newPassword" type="password" required placeholder="Min. 6 characters" minLength={6} />
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block text-slate-700 dark:text-slate-300">Confirm New Password</label>
                <Input name="confirmPassword" type="password" required placeholder="Confirm your new password" minLength={6} />
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-2">
                {loading ? "Updating Security..." : "Change Password"}
            </Button>
        </form>
    );
}
