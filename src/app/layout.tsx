import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextTopLoader from 'nextjs-toploader';
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

export const viewport: Viewport = {
  themeColor: "#020617",
  colorScheme: "dark",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getStoreSettings();
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={inter.className}>
        <NextTopLoader color="#10b981" showSpinner={false} />
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
