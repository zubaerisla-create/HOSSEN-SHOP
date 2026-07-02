import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "./lib/CartContext";
import { AuthProvider } from "./lib/AuthContext";
import { SiteContentProvider } from "./lib/SiteContentContext";
import CartDrawer from "./components/layout/CartDrawer";
import FlashPromoModal from "./components/ui/FlashPromoModal";
import Chatbot from "./components/ui/Chatbot";

export const metadata: Metadata = {
  title: "Hossen Shop | Fresh Grocery Delivery & Organic Food Shop",
  description: "Nourish your home with Earth's finest. Order fresh, organic groceries online from local farms to your doorstep with Hossen Shop. Free delivery on orders over $20.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-site-bg text-neutral-900">
        <SiteContentProvider>
          <AuthProvider>
            <CartProvider>
              {children}
              <CartDrawer />
              <FlashPromoModal />
              <Chatbot />
            </CartProvider>
          </AuthProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
