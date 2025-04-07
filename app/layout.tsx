import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import Header from "@/components/header";
import { dark } from "@clerk/themes";
import { Footer } from "@/components/footer";
import Provider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "Sky Lance - AI Career Coach",
  description: "Sky Lance - AI Career Coach",
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ClerkProvider
        appearance={{
          baseTheme: dark,
        }}
      >
        <html lang="en" suppressHydrationWarning>
          <head />
          <body className={`${inter.className} `}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Provider>
              <Header />
              {children}
              <Toaster />
              <Footer />
            </Provider>
            </ThemeProvider>
          </body>
        </html>
      </ClerkProvider>
    </>
  );
}
