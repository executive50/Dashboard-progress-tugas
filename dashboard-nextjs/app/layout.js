import "./globals.css";

export const metadata = {
  title: "Progress Tugas Pembuatan Aplikasi Mobile — Kelas 06TPLP003",
  description: "Spreadsheet progress bar pemantau pembuatan aplikasi Android (Next.js + Tailwind)",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="bg-slate-100 text-slate-800">{children}</body>
    </html>
  );
}
