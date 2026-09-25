// Master data: tugas + 11 kelompok
export const STATUSES = ["Belum Mulai", "Berjalan", "Selesai", "Tertunda", "Revisi"];

export const TASKS = [
  { id: "t1", modul: "Analisis Kebutuhan & Dokumen SRS", kategori: "Perencanaan", bobot: 5, target: "2026-09-30" },
  { id: "t2", modul: "Desain Wireframe & User Flow", kategori: "UI/UX", bobot: 6, target: "2026-10-07" },
  { id: "t3", modul: "Desain High-Fidelity UI (Figma)", kategori: "UI/UX", bobot: 7, target: "2026-10-14" },
  { id: "t4", modul: "Setup Project (Kotlin, Gradle, Git, Firebase)", kategori: "Setup", bobot: 5, target: "2026-10-10" },
  { id: "t5", modul: "Splash Screen, Onboarding & Navigasi", kategori: "Frontend", bobot: 6, target: "2026-10-21" },
  { id: "t6", modul: "Autentikasi (Login, Register, OTP, Google)", kategori: "Frontend", bobot: 8, target: "2026-10-28" },
  { id: "t7", modul: "Dashboard / Home & Bottom Nav", kategori: "Frontend", bobot: 7, target: "2026-11-04" },
  { id: "t8", modul: "Modul Profil & Pengaturan", kategori: "Frontend", bobot: 5, target: "2026-11-11" },
  { id: "t9", modul: "Integrasi REST API (Retrofit/OkHttp)", kategori: "Integrasi", bobot: 8, target: "2026-11-18" },
  { id: "t10", modul: "Database Lokal (Room) & Offline Mode", kategori: "Backend", bobot: 6, target: "2026-11-18" },
  { id: "t11", modul: "Notifikasi Push (FCM)", kategori: "Integrasi", bobot: 5, target: "2026-11-25" },
  { id: "t12", modul: "Upload File / Gambar & Media", kategori: "Frontend", bobot: 6, target: "2026-11-25" },
  { id: "t13", modul: "Testing Unit, UI (Espresso) & QA", kategori: "Testing", bobot: 7, target: "2026-12-02" },
  { id: "t14", modul: "UAT & Bug Fixing", kategori: "Testing", bobot: 7, target: "2026-12-09" },
  { id: "t15", modul: "Optimasi Performa & Keamanan", kategori: "Testing", bobot: 5, target: "2026-12-12" },
  { id: "t16", modul: "Build Release & Publish Play Store", kategori: "Rilis", bobot: 7, target: "2026-12-16" },
];

export const GROUPS = Array.from({ length: 11 }, (_, i) => ({
  id: `k${i + 1}`,
  name: `Kelompok ${i + 1}`,
  app: `Aplikasi Android K${i + 1}`,
}));

// Contoh awal Kelompok 1 (mirip file Excel), sisanya kosong
export const SEED_K1 = {
  t1: { status: "Selesai", progress: 100, ket: "Dokumen disetujui", pic: "Andi" },
  t2: { status: "Selesai", progress: 100, ket: "Figma terlampir", pic: "Citra" },
  t3: { status: "Berjalan", progress: 75, ket: "3 dari 12 layar revisi", pic: "Citra" },
  t4: { status: "Selesai", progress: 100, ket: "Repo + CI ready", pic: "Budi" },
  t5: { status: "Berjalan", progress: 60, ket: "Animasi 60%", pic: "Budi" },
  t6: { status: "Berjalan", progress: 45, ket: "Login OK, OTP integrasi", pic: "Dewi" },
  t7: { status: "Berjalan", progress: 30, ket: "Layout dasar jadi", pic: "Budi" },
  t9: { status: "Berjalan", progress: 50, ket: "50% endpoint OK", pic: "Dewi" },
  t10: { status: "Belum Mulai", progress: 10, ket: "Entity dirancang", pic: "Eko" },
};

export function blankCell() {
  return { status: "Belum Mulai", progress: 0, ket: "-", pic: "-" };
}

export function weightedTotal(taskList, cells) {
  let tot = 0;
  for (const t of taskList) {
    const c = cells?.[t.id];
    tot += ((+t.bobot || 0) * (+c?.progress || 0)) / 100;
  }
  return tot; // 0-100 karena bobot total 100
}
