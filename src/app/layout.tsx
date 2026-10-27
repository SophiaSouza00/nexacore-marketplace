import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { obterSessaoAtual } from "@/lib/auth";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NexaCore | Sua Loja de Informática e Hardware",
    template: "%s | NexaCore",
  },
  description:
    "NexaCore — Hardware de alta performance, computadores, periféricos e componentes de tecnologia com qualidade, procedência e garantia.",
  keywords: [
    "informática",
    "hardware",
    "computadores",
    "placa de vídeo",
    "processadores",
    "memória RAM",
    "NexaCore",
  ],
  authors: [{ name: "NexaCore" }],
};

export const viewport: Viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const usuario = await obterSessaoAtual();

  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans selection:bg-cyan-500 selection:text-slate-950 flex flex-col">
        <CartProvider>
          <Header usuario={usuario} />
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
