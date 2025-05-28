// frontend-cursos/src/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from '../components/Header';
import Footer from '../components/footer';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevCursos",
  description: "Plataforma de cursos de programación y desarrollo web.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-gray-950 text-white`}>
        <div style={{ display: 'grid', minHeight: '100dvh', gridTemplateRows: 'auto 1fr auto' }}>
          <Header />
          <main className="container mx-auto px-4 py-8 min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}