import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "EduLead — O‘quv markaz landing",
  description: "O‘quv markazlar uchun ariza yig‘uvchi landing page.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz">
      <body>{children}</body>
    </html>
  );
}
