import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { useEffect } from "react"; // IMPORTANTE: Para que funcione la traducción

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TIPHERET HARMONY STATION",
  description: "Auditoría de Ingeniería Facial & Bio-Escaner 3D",
  manifest: "/manifest.json",
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
  userScalable: false,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  // MOTOR DE TRADUCCIÓN TIPHERET (Inyectado para que no falle)
  useEffect(() => {
    const translateApp = async () => {
      try {
        const response = await fetch('/i18n.json');
        if (!response.ok) return;
        const translations = await response.json();

        // Detecta idioma: Portugués, Inglés o Español por defecto
        const browserLang = navigator.language.split('-')[0];
        const lang = ['es', 'en', 'pt'].includes(browserLang) ? browserLang : 'en';

        // Busca y traduce elementos marcados
        document.querySelectorAll('[data-i18n]').forEach((el) => {
          const key = el.getAttribute('data-i18n');
          if (key) {
            const text = key.split('.').reduce((obj, i) => obj?.[i], translations);
            if (text && text[lang]) {
              (el as HTMLElement).innerText = text[lang];
            }
          }
        });
      } catch (error) {
        console.error("Error cargando i18n:", error);
      }
    };

    translateApp();
  }, []);

  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}