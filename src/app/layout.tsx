import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'LaunchPad — Space-Tech Cloud Acceleration',
  description: 'Next-generation orbital infrastructure and deployment control plane.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="bg-midnight-950 text-text-primary antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
