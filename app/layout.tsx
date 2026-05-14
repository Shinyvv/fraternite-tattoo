import type { Metadata } from "next";
import "@/styles/globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "La Fraternite Tattoo & Piercing",
  description: "Sistema de reservas moderno para estudio tattoo en Talagante"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        {children}
        <Toaster />
      </body>
    </html>
  );
}

