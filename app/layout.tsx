import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const syne = Syne({
  variable: '--font-syne',
  subsets: ['latin'],
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Pic2Component — Screenshot to Component Tree',
  description:
    'Convert any UI screenshot into a semantic component hierarchy with design tokens and exportable React, HTML, and Tailwind code. Powered by AI.',
  keywords: ['UI to code', 'screenshot to component', 'design to code', 'component detection', 'design system'],
  openGraph: {
    title: 'Pic2Component',
    description: 'Convert any UI screenshot into a component tree instantly.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${syne.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1A1A26',
              color: '#F0F0FF',
              border: '1px solid rgba(120, 120, 200, 0.2)',
            },
          }}
        />
      </body>
    </html>
  );
}
