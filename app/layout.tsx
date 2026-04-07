import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'MineAsset Tracker',
  description: 'Gestión de activos críticos para minería'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <main className="mx-auto min-h-screen max-w-7xl p-6">{children}</main>
      </body>
    </html>
  );
}
