# Dashboard Progress Android — 11 Kelompok (Next.js + Tailwind)

Spreadsheet progress bar untuk memantau pembuatan aplikasi Android.
Tiap kelompok (Kelompok 1–11) update progresnya sendiri, tersimpan via API.

## Jalankan

```bash
cd dashboard-nextjs
npm install
npm run dev
```

Buka http://localhost:3000

## Fitur
- Tab 11 kelompok + peringkat otomatis (total berbobot)
- Tabel spreadsheet: Status (dropdown), Progress (slider 0–100), Progress Bar, PIC, Keterangan
- Filter kategori / status / cari, rekap per kategori
- Total = Σ(bobot × progress), bobot tasks = 100%
- Data tersimpan di `data/progress.json` via `PUT /api/progress`

## Struktur
- `app/page.js` + `components/Dashboard.jsx` — UI
- `lib/data.js` — 16 tugas master + 11 kelompok
- `lib/store.js` — baca/tulis JSON
- `app/api/progress/route.js` — GET + PUT
- `data/progress.json` — dibuat otomatis saat pertama jalan

## Deploy
`npm run build` lalu `npm start`. Cocok untuk Vercel (ganti store file ke database jika multi-instance).
