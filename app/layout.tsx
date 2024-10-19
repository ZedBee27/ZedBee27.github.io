import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/providers/ThemeProvider";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Virtual Assessment Platform",
  description: "A virtual assessment platform for students to prepare for their exams online. It provides a wide range of subjects and topics to choose from and practice. It also provides simulated exams to help students prepare for their exams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
      <html lang="en">
        <body className={inter.className && 'min-h-[100vh]'}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true} storageKey="dashboard-theme">
            {children}
            <Toaster/>
          </ThemeProvider>
        </body>
      </html>

  );
}
