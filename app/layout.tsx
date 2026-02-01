import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

// CONFIGURACIÓN DE LA APP (ICONOS Y PANTALLA COMPLETA)
export const metadata: Metadata = {
  title: "TIPHERET HARMONY STATION",
  description: "Auditoría de Ingeniería Facial & Bio-Escaner 3D",
  manifest: "/manifest.json", // Archivo de configuración de App
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TIPHERET",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Bloquea el zoom para sentirla nativa
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ICONO DE LA APP (Debe estar en la carpeta public) */}
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}