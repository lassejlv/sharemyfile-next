import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import "@uploadthing/react/styles.css";

const pop = Poppins({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Share my file",
  description: "Easily share files with friends and family",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="min-h-screen bg-background dark font-sans antialiased"
    >
      <body className={pop.className}>
        <Toaster
          theme="dark"
          richColors
          visibleToasts={1}
          position="bottom-center"
        />
        {children}
      </body>
    </html>
  );
}
