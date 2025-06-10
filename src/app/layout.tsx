import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Portal Urgência Segura',
  description: 'Sistema de monitoramento de solicitações de urgência.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <AuthProvider>
          <Header />
          <main className="p-4">{children}</main>
          <footer className="bg-gray-200 text-center p-4 text-sm">
            &copy; {new Date().getFullYear()} Urgência Segura
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
