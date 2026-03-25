import type { Metadata } from "next";
import { Geist, Geist_Mono, Ubuntu } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "BOSS MUSIC",
  description: "Generate your own music for Youtube",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${ubuntu.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
          <AuthProvider>{children}</AuthProvider>
        </body>
    </html>
  );
}
