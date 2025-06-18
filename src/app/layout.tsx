import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "StillSky - Beautiful Weather App",
  description: "Experience weather like never before with StillSky - a stunning, modern weather application with real-time forecasts and beautiful visualizations.",
  keywords: ["weather", "forecast", "app", "beautiful", "modern"],
  authors: [{ name: "StillSky Team" }],
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
