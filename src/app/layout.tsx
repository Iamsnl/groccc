import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getStoreSettings } from "@/lib/settings";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getStoreSettings();
  return {
    title: `${settings.storeName} - Modern Grocery Delivery`,
    description: "Premium grocery shopping experience with lightning fast delivery.",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <Navbar storeName={settings.storeName} />
            <main className="flex-1 bg-slate-50/50 dark:bg-slate-950">
              {children}
            </main>
            <Footer storeName={settings.storeName} />
          </div>
        </Providers>
      </body>
    </html>
  );
}
