import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Nav from "./ui/nav";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HyperTrio",
  description: "Your fitness companion",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if the current URL is the dashboard path
  // This is a client component, so we need to use usePathname from next/navigation
  // But since we can't use hooks in a Server Component, we'll use a different approach
  
  return (
    <html lang="en" data-theme="autumn">
      <body
        className={`bg-background text-foreground ${outfit.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
