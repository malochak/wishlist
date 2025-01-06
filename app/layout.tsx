import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Toaster } from "@/components/ui/toaster";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import Footer from "@/components/footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Wishlist App",
  description: "Create and share your wishlist with friends and family",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <nav className="w-full border-b border-b-foreground/10 h-16">
              <div className="container mx-auto h-full flex justify-between items-center">
                <div className="flex items-center gap-8">
                  <Link
                    href={"/"}
                    className="text-xl font-semibold hover:text-primary"
                  >
                    Wishlist
                  </Link>
                  <Link
                    href={"/protected/dashboard"}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Dashboard
                  </Link>
                </div>
                <div className="flex items-center gap-4">
                  <ThemeSwitcher />
                  <HeaderAuth />
                </div>
              </div>
            </nav>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
