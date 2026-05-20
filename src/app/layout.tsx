import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Property Media Gallery",
  description:
    "A cinematic carousel for condo and environment shots, designed for fast browsing on desktop and mobile.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
