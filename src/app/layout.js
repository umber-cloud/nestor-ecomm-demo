import { Orbitron, Space_Grotesk, Space_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { CartProvider } from "@/lib/cartContext";
import { AuthProvider } from "./context/auth-context";
import { Toaster } from "@/components/ui/toaster";
import { CartFlyAnimationProvider } from "@/components/cartFlyAnimation";

const fontSerif = Orbitron({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const fontSans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const fontMono = Space_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata = {
  title: "InfinityGadgets — Curated Essentials",
  description:
    "A curated collection of apparel, accessories, and everyday essentials.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body
        suppressHydrationWarning
        className={`${fontSerif.variable} ${fontSans.variable} ${fontMono.variable} antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            <CartFlyAnimationProvider>
              <Header />
              <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-2 justify-center flex flex-col pt-24">
                {children}
              </main>
              <Footer />
              <Toaster />
            </CartFlyAnimationProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
