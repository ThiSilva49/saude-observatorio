import type { Metadata, Viewport } from "next";
import { InstallPrompt } from "@/components/InstallPrompt";
import { RegisterServiceWorker } from "@/components/RegisterServiceWorker";
import "./globals.css";

export const metadata: Metadata = {
  title: "Saúde Observada",
  description:
    "Painel público com indicadores de dengue, COVID-19, tuberculose, HIV/Aids, sífilis, diabetes, hipertensão, obesidade, saúde mental e câncer no Brasil, por estado, município, ano e mês.",
  applicationName: "Saúde Observada",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Saúde Observada",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#15803d",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <RegisterServiceWorker />
        {children}
        <div className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
          <div className="w-full max-w-2xl">
            <InstallPrompt />
          </div>
        </div>
      </body>
    </html>
  );
}
