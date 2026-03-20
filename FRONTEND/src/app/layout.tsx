// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LensKart — India's #1 Eyewear Brand",
  description:
    "Premium eyewear — Eyeglasses, Sunglasses & Contact Lenses. Virtual try-on, free delivery.",
  keywords:
    "eyewear, glasses, sunglasses, contact lenses, eyeglasses india",
  openGraph: {
    title: "LensKart",
    description: "Shop premium eyewear online",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        style={{ background: "#F8FAFC" }}
      >
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>

              {/* Navbar — Har page pe */}
              <Navbar />

              {/* Main Content */}
              <main className="min-h-screen">
                {children}
              </main>

              {/* Footer — Har page pe */}
              <Footer />

              {/* Toast Notifications */}
              <Toaster
                position="bottom-center"
                toastOptions={{
                  style: {
                    background: "#0F172A",
                    color: "#fff",
                    borderRadius: "999px",
                    fontWeight: "600",
                    fontSize: "14px",
                    padding: "12px 24px",
                  },
                  success: {
                    iconTheme: {
                      primary: "#0EA5E9",
                      secondary: "#fff",
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: "#EF4444",
                      secondary: "#fff",
                    },
                  },
                }}
              />

            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
