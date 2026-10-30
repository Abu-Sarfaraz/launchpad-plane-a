import type { Metadata } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'PaperGen — AI-Powered Exam & Worksheet Studio',
  description: 'Next-generation AI examination paper generator and academic worksheet studio.',
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
