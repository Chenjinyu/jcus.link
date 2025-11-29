import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JC US Link",
  description: "JC(Jinyu Chen) - Personal website with articles and chatbot",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col h-screen overflow-hidden`}>
        <div
          className="flex flex-col h-full w-full"
          style={{ background: "rgb(38, 38, 41)" }}
        >
          {/* the chilerend prop in the layout automatically receives the page content */}
          { /* Nuqs is a library to managing URL query parameters as typed state in Rreact apps */}
          <NuqsAdapter>{children}</NuqsAdapter> 
        </div>
      </body>
    </html>
  );
}
