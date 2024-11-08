// app/layout.js
"use client";
import { SessionProvider } from 'next-auth/react';
import './globals.css';  // Pastikan path-nya benar

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-gray-100 min-h-screen">  {/* Gaya Tailwind diterapkan di sini */}
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
