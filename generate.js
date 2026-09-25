const ExcelJS = require('exceljs');
const path = require('path');

async function main() {
  const wb = new ExcelJS.Workbook();
  wb.creator = 'Dashboard Progress';
  wb.created = new Date();

  // --- Styles ---
  const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
  const TITLE_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E79' } };
  const ACCENT_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E2F3' } };
  const GREEN_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } };
  const YELLOW_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } };
  const RED_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } };
  const GREY_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F2F2' } };
  const BLUE_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFDDEBF7' } };

  const headerFont = { name: 'Calibri', bold: true, color: { argb: 'FFFFFFFF' }, size: 11 };
  const titleFont = { name: 'Calibri', bold: true, color: { argb: 'FFFFFFFF' }, size: 16 };
  const subFont = { name: 'Calibri', color: { argb: 'FFFFFFFF' }, size: 11 };
  const normalFont = { name: 'Calibri', size: 11 };
  const boldFont = { name: 'Calibri', size: 11, bold: true };

  const thinBorder = {
    top: { style: 'thin', color: { argb: 'FFB4C6E7' } },
    left: { style: 'thin', color: { argb: 'FFB4C6E7' } },
    bottom: { style: 'thin', color: { argb: 'FFB4C6E7' } },
    right: { style: 'thin', color: { argb: 'FFB4C6E7' } },
  };

  const tasks = [
    [1, 'Analisis Kebutuhan & Dokumen SRS', 'Perencanaan', 'Andi', 5, '2026-09-30', 'Selesai', 100, 'Dokumen disetujui'],
    [2, 'Desain Wireframe & User Flow', 'UI/UX', 'Citra', 6, '2026-10-07', 'Selesai', 100, 'Figma link terlampir'],
    [3, 'Desain High-Fidelity UI (Figma)', 'UI/UX', 'Citra', 7, '2026-10-14', 'Berjalan', 75, '3 dari 12 layar revisi'],
    [4, 'Setup Project (Kotlin, Gradle, Git, Firebase)', 'Setup', 'Budi', 5, '2026-10-10', 'Selesai', 100, 'Repo + CI ready'],
    [5, 'Splash Screen, Onboarding & Navigasi', 'Frontend', 'Budi', 6, '2026-10-21', 'Berjalan', 60, 'Navigasi selesai, animasi 60%'],
    [6, 'Autentikasi (Login, Register, OTP, Google Sign-In)', 'Frontend', 'Dewi', 8, '2026-10-28', 'Berjalan', 45, 'Login OK, OTP integrasi'],
    [7, 'Dashboard / Home & Bottom Navigation', 'Frontend', 'Budi', 7, '2026-11-04', 'Berjalan', 30, 'Layout dasar jadi'],
    [8, 'Modul Profil & Pengaturan', 'Frontend', 'Eko', 5, '2026-11-11', 'Belum Mulai', 0, 'Menunggu API user'],
    [9, 'Integrasi REST API (Retrofit/OkHttp)', 'Integrasi', 'Dewi', 8, '2026-11-18', 'Berjalan', 50, '50% endpoint terhubung'],
    [10, 'Database Lokal (Room) & Offline Mode', 'Backend', 'Eko', 6, '2026-11-18', 'Belum Mulai', 10, 'Entity dirancang'],
    [11, 'Notifikasi Push (FCM)', 'Integrasi', 'Dewi', 5, '2026-11-25', 'Belum Mulai', 0, 'Menunggu Firebase key'],
    [12, 'Upload File / Gambar & Media', 'Frontend', 'Budi', 6, '2026-11-25', 'Belum Mulai', 0, '-'],
    [13, 'Testing Unit, UI (Espresso) & QA', 'Testing', 'Tim QA', 7, '2026-12-02', 'Belum Mulai', 0, '-'],
    [14, 'UAT & Bug Fixing', 'Testing', 'Tim QA', 7, '2026-12-09', 'Belum Mulai', 0, '-'],
    [15, 'Optimasi Performa & Keamanan (Proguard, Obfuscation)', 'Testing', 'Eko', 5, '2026-12-12', 'Belum Mulai', 0, '-'],
    [16, 'Build Release, Signing & Publish Play Store', 'Rilis', 'Andi', 7, '2026-12-16', 'Belum Mulai', 0, '-'],
  ];

  // ================= SHEET 1: DASHBOARD =================
  const dash = wb.addWorksheet('Dashboard', {
    views: [{ showGridLines: false }],
    pageSetup: { fitToPage: true, orientation: 'landscape' },
  });
  dash.properties.tabColor = { argb: 'FF1F4E79' };

  dash.columns = [
    { width: 22 }, { width: 22 }, { width: 22 }, { width: 22 }, { width: 22 }, { width: 22 },
  ];

  // Judul
  dash.mergeCells('A1:F1');
  const t1 = dash.getCell('A1');
  t1.value = 'DASHBOARD PROGRESS PEMBUATAN APLIKASI ANDROID';
  t1.font = titleFont; t1.fill = TITLE_FILL; t1.alignment = { horizontal: 'center', vertical: 'middle' };
  dash.getRow(1).height = 32;

  dash.mergeCells('A2:F2');
  const t2 = dash.getCell('A2');
  t2.value = 'Spreadsheet pemantau progres • Update kolom Status & Progress di sheet "Progress Detail" • Total otomatis berbobot';
  t2.font = subFont; t2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
  t2.alignment = { horizontal: 'center', vertical: 'middle' };
  dash.getRow(2).height = 20;

  // Info proyek (baris 3-4)
  dash.getCell('A3').value = 'Nama Aplikasi :'; dash.getCell('A3').font = boldFont;
  dash.getCell('B3').value = 'MyAndroidApp v1.0'; dash.getCell('B3').font = normalFont;
  dash.getCell('D3').value = 'Tanggal Update :'; dash.getCell('D3').font = boldFont;
  dash.getCell('E3').value = new Date(); dash.getCell('E3').numFmt = 'dd mmmm yyyy'; dash.getCell('E3').font = normalFont;

  dash.getCell('A4').value = 'Platform :'; dash.getCell('A4').font = boldFont;
  dash.getCell('B4').value = 'Android Native (Kotlin)'; dash.getCell('B4').font = normalFont;
  dash.getCell('D4').value = 'Target Rilis :'; dash.getCell('D4').font = boldFont;
  dash.getCell('E4').value = new Date(2026, 11, 16); dash.getCell('E4').numFmt = 'dd mmmm yyyy'; dash.getCell('E4').font = normalFont;

  // KPI Header
  dash.mergeCells('A6:F6');
  const kpiH = dash.getCell('A6');
  kpiH.value = 'RINGKASAN PROGRESS (OTOMATIS)';
  kpiH.font = headerFont; kpiH.fill = HEADER_FILL; kpiH.alignment = { horizontal: 'center', vertical: 'middle' };
  dash.getRow(6).height = 22;

  const kpiLabels = ['TOTAL PROGRESS', 'TOTAL MODUL', 'SELESAI', 'BERJALAN', 'BELUM MULAI', 'TERTUNDA / REVISI'];
  kpiLabels.forEach((label, i) => {
    const c = dash.getRow(7).getCell(i + 1);
    c.value = label; c.font = { ...boldFont, size: 10 }; c.fill = ACCENT_FILL;
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = thinBorder;
  });
  dash.getRow(7).height = 30;

  // KPI Values row 8
  // A8: total progress berbobot = SUMPRODUCT('Progress Detail'!E12:E27, 'Progress Detail'!H12:H27)/100
  const row8 = dash.getRow(8);
  row8.height = 36;
  const detailRangeBobot = `'Progress Detail'!E12:E27`;
  const detailRangeProg = `'Progress Detail'!H12:H27`;
  const detailRangeStatus = `'Progress Detail'!G12:G27`;

  const kpiFormulas = [
    `=SUMPRODUCT(${detailRangeBobot},${detailRangeProg})/100`,
    `=COUNTA(${detailRangeStatus})`,
    `=COUNTIF(${detailRangeStatus},"Selesai")`,
    `=COUNTIF(${detailRangeStatus},"Berjalan")`,
    `=COUNTIF(${detailRangeStatus},"Belum Mulai")`,
    `=COUNTIF(${detailRangeStatus},"Tertunda")+COUNTIF(${detailRangeStatus},"Revisi")`,
  ];
  kpiFormulas.forEach((f, i) => {
    const c = row8.getCell(i + 1);
    c.value = { formula: f };
    c.font = { name: 'Calibri', bold: true, size: 18, color: { argb: 'FF1F4E79' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' };
    c.border = thinBorder;
    if (i === 0) c.numFmt = '0.0"%"';
  });
  // Warna khusus KPI
  row8.getCell(3).fill = GREEN_FILL;
  row8.getCell(4).fill = YELLOW_FILL;
  row8.getCell(5).fill = GREY_FILL;
  row8.getCell(6).fill = RED_FILL;

  dash.mergeCells('A9:F9');
  const note = dash.getCell('A9');
  note.value = 'Cara pakai: 1) Isi PIC & Target di sheet Progress Detail  2) Ubah Status via dropdown  3) Isi Progress 0–100  4) Progress Bar & Dashboard terupdate otomatis';
  note.font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF404040' } };
  note.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
  dash.getRow(9).height = 28;

  // Rekap per kategori
  dash.mergeCells('A11:F11');
  const rk = dash.getCell('A11');
  rk.value = 'REKAP PER KATEGORI';
  rk.font = headerFont; rk.fill = HEADER_FILL; rk.alignment = { horizontal: 'center', vertical: 'middle' };
  dash.getRow(11).height = 22;

  const catHeaders = ['Kategori', 'Jml Modul', 'Selesai', 'Berjalan', 'Rata2 Progress', 'Sisa Bobot'];
  catHeaders.forEach((h, i) => {
    const c = dash.getRow(12).getCell(i + 1);
    c.value = h; c.font = headerFont; c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
    c.alignment = { horizontal: 'center', vertical: 'middle' }; c.border = thinBorder;
  });
  dash.getRow(12).height = 20;

  const categories = ['Perencanaan', 'UI/UX', 'Setup', 'Frontend', 'Backend', 'Integrasi', 'Testing', 'Rilis'];
  // Kolom kategori di Detail = C12:C27
  categories.forEach((cat, idx) => {
    const r = dash.getRow(13 + idx);
    r.height = 18;
    r.getCell(1).value = cat;
    r.getCell(1).font = boldFont; r.getCell(1).alignment = { horizontal: 'left', vertical: 'middle' };
    // Jml modul
    r.getCell(2).value = { formula: `=COUNTIF('Progress Detail'!C12:C27,A${13 + idx})` };
    r.getCell(3).value = { formula: `=COUNTIFS('Progress Detail'!C12:C27,A${13 + idx},'Progress Detail'!G12:G27,"Selesai")` };
    r.getCell(4).value = { formula: `=COUNTIFS('Progress Detail'!C12:C27,A${13 + idx},'Progress Detail'!G12:G27,"Berjalan")` };
    r.getCell(5).value = { formula: `=IF(B${13 + idx}=0,0,AVERAGEIF('Progress Detail'!C12:C27,A${13 + idx},'Progress Detail'!H12:H27))` };
    r.getCell(5).numFmt = '0"%"';
    r.getCell(6).value = { formula: `=SUMIFS('Progress Detail'!E12:E27,'Progress Detail'!C12:C27,A${13 + idx},'Progress Detail'!G12:G27,"<>Selesai")` };
    r.getCell(6).numFmt = '0"%"';
    for (let c = 1; c <= 6; c++) {
      const cell = r.getCell(c);
      cell.border = thinBorder; cell.font = normalFont;
      cell.alignment = { horizontal: c === 1 ? 'left' : 'center', vertical: 'middle' };
      if (idx % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F8FF' } };
    }
    // DataBar mini? tidak, cukup angka
  });

  // Legenda
  dash.mergeCells('A22:F22');
  const lg = dash.getCell('A22');
  lg.value = 'LEGENDA STATUS';
  lg.font = headerFont; lg.fill = HEADER_FILL; lg.alignment = { horizontal: 'center', vertical: 'middle' };
  dash.getRow(22).height = 22;
  const legends = [
    ['Selesai', 'FFC6EFCE', 'FF006100'],
    ['Berjalan', 'FFFFEB9C', 'FF9C5700'],
    ['Belum Mulai', 'FFF2F2F2', 'FF404040'],
    ['Tertunda', 'FFFFC7CE', 'FF9C0006'],
    ['Revisi', 'FFFFC7CE', 'FF9C0006'],
    ['Target lewat & belum selesai = perlu perhatian', 'FF1F4E79', 'FFFFFFFF'],
  ];
  legends.forEach((L, i) => {
    const r = 23 + Math.floor(i / 3);
    const col = (i % 3) * 2 + 1;
    const c1 = dash.getRow(r).getCell(col);
    c1.value = L[0];
    c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: L[1] } };
    c1.font = { name: 'Calibri', size: 10, bold: true, color: { argb: L[2] } };
    c1.alignment = { horizontal: 'center', vertical: 'middle' };
    c1.border = thinBorder;
    dash.getRow(r).height = 20;
    // merge 2 kolom untuk tiap legenda? tidak, biarkan 1 kolom + spacer
  });

  dash.mergeCells('A26:F26');
  const f1 = dash.getCell('A26');
  f1.value = 'TIP: Aktifkan Filter di sheet Progress Detail untuk memantau per PIC / Kategori / Status. Cetak landscape A4 (File > Print).';
  f1.font = { name: 'Calibri', size: 10, italic: true };
  f1.alignment = { horizontal: 'center', wrapText: true, vertical: 'middle' };

  // Lebar kolom dashboard sudah di atas

  // ================= SHEET 2: PROGRESS DETAIL =================
  const ws = wb.addWorksheet('Progress Detail', {
    views: [{ state: 'frozen', ySplit: 11 }],
    pageSetup: { fitToPage: true, orientation: 'landscape', paperSize: 9 },
  });
  ws.properties.tabColor = { argb: 'FF2E75B6' };

  ws.columns = [
    { width: 6 },   // A No
    { width: 42 },  // B Modul
    { width: 14 },  // C Kategori
    { width: 13 },  // D PIC
    { width: 10 },  // E Bobot
    { width: 14 },  // F Target
    { width: 14 },  // G Status
    { width: 12 },  // H Progress
    { width: 26 },  // I Bar
    { width: 28 },  // J Keterangan
  ];

  // Judul
  ws.mergeCells('A1:J1');
  const w1 = ws.getCell('A1');
  w1.value = 'PROGRESS DETAIL PEMBUATAN APLIKASI ANDROID';
  w1.font = titleFont; w1.fill = TITLE_FILL; w1.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(1).height = 30;

  ws.mergeCells('A2:J2');
  const w2 = ws.getCell('A2');
  w2.value = 'Isi kolom Status (dropdown) dan Progress (0–100). Kolom Progress Bar terisi otomatis via formula.';
  w2.font = subFont; w2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF2E75B6' } };
  w2.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(2).height = 20;

  // Summary strip baris 3-5
  ws.mergeCells('A3:C3'); ws.getCell('A3').value = 'TOTAL PROGRESS BERBOBOT'; ws.getCell('A3').font = boldFont; ws.getCell('A3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('A3').fill = ACCENT_FILL;
  ws.mergeCells('A4:C5');
  const tot = ws.getCell('A4');
  tot.value = { formula: '=SUMPRODUCT(E12:E27,H12:H27)/100' };
  tot.numFmt = '0.0"%"';
  tot.font = { name: 'Calibri', bold: true, size: 26, color: { argb: 'FF1F4E79' } };
  tot.alignment = { horizontal: 'center', vertical: 'middle' };
  tot.fill = BLUE_FILL; tot.border = thinBorder;

  ws.getCell('D3').value = 'Total Bobot'; ws.getCell('D3').font = boldFont; ws.getCell('D3').fill = ACCENT_FILL; ws.getCell('D3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('D3').border = thinBorder;
  ws.getCell('D4').value = { formula: '=SUM(E12:E27)' }; ws.getCell('D4').numFmt = '0"%"'; ws.getCell('D4').font = { ...boldFont, size: 14 }; ws.getCell('D4').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('D4').border = thinBorder;

  ws.getCell('E3').value = 'Selesai'; ws.getCell('E3').font = boldFont; ws.getCell('E3').fill = GREEN_FILL; ws.getCell('E3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('E3').border = thinBorder;
  ws.getCell('E4').value = { formula: '=COUNTIF(G12:G27,"Selesai")&" / "&COUNTA(G12:G27)' }; ws.getCell('E4').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('E4').font = boldFont; ws.getCell('E4').border = thinBorder; ws.getCell('E4').fill = GREEN_FILL;

  ws.getCell('F3').value = 'Berjalan'; ws.getCell('F3').font = boldFont; ws.getCell('F3').fill = YELLOW_FILL; ws.getCell('F3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('F3').border = thinBorder;
  ws.getCell('F4').value = { formula: '=COUNTIF(G12:G27,"Berjalan")' }; ws.getCell('F4').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('F4').font = { ...boldFont, size: 14 }; ws.getCell('F4').border = thinBorder; ws.getCell('F4').fill = YELLOW_FILL;

  ws.getCell('G3').value = 'Belum Mulai'; ws.getCell('G3').font = boldFont; ws.getCell('G3').fill = GREY_FILL; ws.getCell('G3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('G3').border = thinBorder;
  ws.getCell('G4').value = { formula: '=COUNTIF(G12:G27,"Belum Mulai")' }; ws.getCell('G4').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('G4').font = { ...boldFont, size: 14 }; ws.getCell('G4').border = thinBorder; ws.getCell('G4').fill = GREY_FILL;

  ws.getCell('H3').value = 'Tertunda / Revisi'; ws.getCell('H3').font = boldFont; ws.getCell('H3').fill = RED_FILL; ws.getCell('H3').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('H3').border = thinBorder;
  ws.getCell('H4').value = { formula: '=COUNTIF(G12:G27,"Tertunda")+COUNTIF(G12:G27,"Revisi")' }; ws.getCell('H4').alignment = { horizontal: 'center', vertical: 'middle' }; ws.getCell('H4').font = { ...boldFont, size: 14 }; ws.getCell('H4').border = thinBorder; ws.getCell('H4').fill = RED_FILL;

  ws.mergeCells('I3:J3'); ws.getCell('I3').value = 'CARA UPDATE CEPAT'; ws.getCell('I3').font = boldFont; ws.getCell('I3').fill = ACCENT_FILL; ws.getCell('I3').alignment = { horizontal: 'center', vertical: 'middle' };
  ws.mergeCells('I4:J5');
  const how = ws.getCell('I4');
  how.value = '1. Pilih Status dari dropdown\n2. Ketik Progress 0-100\n3. Bar & Dashboard otomatis update\n4. Filter per PIC/Kategori bila perlu';
  how.font = { name: 'Calibri', size: 10 }; how.alignment = { wrapText: true, vertical: 'middle', horizontal: 'left' }; how.border = thinBorder;
  ws.getRow(4).height = 42; ws.getRow(5).height = 14;

  ws.mergeCells('A6:J6');
  const chk = ws.getCell('A6');
  chk.value = { formula: '=IF(SUM(E12:E27)<>1,"⚠ Total Bobot harus 100% — saat ini "&TEXT(SUM(E12:E27),"0%"),"✔ Total Bobot 100% — valid")' };
  chk.font = { name: 'Calibri', size: 10, bold: true }; chk.alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(6).height = 18;

  // Header tabel baris 11? Kita pakai baris 11 sebagai header agar freeze rapi (judul + ringkasan di atas)
  // Baris 7-10: spacer + info kolom
  ws.mergeCells('A8:J8');
  ws.getCell('A8').value = 'TABEL PROGRESS MODUL — klik panah filter pada header untuk sortir / filter';
  ws.getCell('A8').font = { name: 'Calibri', size: 10, italic: true, color: { argb: 'FF404040' } };
  ws.getCell('A8').alignment = { horizontal: 'center', vertical: 'middle' };
  ws.getRow(8).height = 18;

  const headers = ['No', 'Modul / Fitur', 'Kategori', 'PIC', 'Bobot', 'Target Selesai', 'Status', 'Progress', 'Progress Bar', 'Keterangan'];
  const hr = ws.getRow(11);
  hr.height = 24;
  headers.forEach((h, i) => {
    const c = hr.getCell(i + 1);
    c.value = h; c.font = headerFont; c.fill = HEADER_FILL;
    c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    c.border = thinBorder;
  });

  // Isi data mulai baris 12
  tasks.forEach((t, idx) => {
    const rNum = 12 + idx;
    const r = ws.getRow(rNum);
    r.height = 22;
    // A No
    r.getCell(1).value = t[0];
    // B Modul
    r.getCell(2).value = t[1];
    // C Kategori
    r.getCell(3).value = t[2];
    // D PIC
    r.getCell(4).value = t[3];
    // E Bobot (0-1, tampil %)
    r.getCell(5).value = t[4] / 100;
    r.getCell(5).numFmt = '0"%"';
    // F Target
    const d = new Date(t[5] + 'T00:00:00');
    r.getCell(6).value = d;
    r.getCell(6).numFmt = 'dd-mm-yyyy';
    // G Status
    r.getCell(7).value = t[6];
    // H Progress (0-1, tampil %)
    r.getCell(8).value = t[7] / 100;
    r.getCell(8).numFmt = '0"%"';
    // I Progress Bar via REPT formula: =REPT("█",ROUND(H12*10,0))&" "&TEXT(H12,"0%")
    r.getCell(9).value = { formula: `=REPT("█",ROUND(H${rNum}*10,0))&" "&TEXT(H${rNum},"0%")` };
    r.getCell(9).font = { name: 'Consolas', size: 11, color: { argb: 'FF2E75B6' } };
    // J Keterangan
    r.getCell(10).value = t[8];

    for (let c = 1; c <= 10; c++) {
      const cell = r.getCell(c);
      cell.border = thinBorder;
      if (c !== 9) cell.font = normalFont;
      if (c === 1 || c === 3 || c === 4 || c === 5 || c === 6 || c === 7 || c === 8) {
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
      } else {
        cell.alignment = { vertical: 'middle', wrapText: true };
      }
      // stripe
      if (idx % 2 === 0) {
        if (!cell.fill || !cell.fill.fgColor) {
          // jangan timpa font warna bar
        }
        // gunakan fill ringan via bg? ExcelJS perlu set fill eksplisit
        // hanya untuk kolom selain I agar bar tetap jelas
        if (c !== 9) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF2F8FF' } };
      }
    }
    // Warna status awal
    const sc = r.getCell(7);
    if (t[6] === 'Selesai') { sc.fill = GREEN_FILL; sc.font = { ...normalFont, bold: true, color: { argb: 'FF006100' } }; }
    else if (t[6] === 'Berjalan') { sc.fill = YELLOW_FILL; sc.font = { ...normalFont, bold: true, color: { argb: 'FF9C5700' } }; }
    else if (t[6] === 'Belum Mulai') { sc.fill = GREY_FILL; }
  });

  // Total baris 28
  const tr = ws.getRow(28);
  tr.height = 22;
  tr.getCell(1).value = ''; 
  ws.mergeCells('A28:D28');
  tr.getCell(1).value = 'TOTAL';
  tr.getCell(1).font = { ...boldFont, size: 12 }; tr.getCell(1).alignment = { horizontal: 'right', vertical: 'middle' };
  tr.getCell(1).fill = ACCENT_FILL; tr.getCell(1).border = thinBorder;
  for (let c = 2; c <= 4; c++) { tr.getCell(c).fill = ACCENT_FILL; tr.getCell(c).border = thinBorder; }
  tr.getCell(5).value = { formula: '=SUM(E12:E27)' }; tr.getCell(5).numFmt = '0"%"'; tr.getCell(5).font = { ...boldFont, size: 12 };
  tr.getCell(5).fill = ACCENT_FILL; tr.getCell(5).alignment = { horizontal: 'center', vertical: 'middle' }; tr.getCell(5).border = thinBorder;
  tr.getCell(6).value = ''; tr.getCell(6).fill = ACCENT_FILL; tr.getCell(6).border = thinBorder;
  tr.getCell(7).value = { formula: '=COUNTIF(G12:G27,"Selesai")&" selesai"' }; tr.getCell(7).font = boldFont; tr.getCell(7).fill = ACCENT_FILL; tr.getCell(7).alignment = { horizontal: 'center', vertical: 'middle' }; tr.getCell(7).border = thinBorder;
  tr.getCell(8).value = { formula: '=SUMPRODUCT(E12:E27,H12:H27)/100' }; tr.getCell(8).numFmt = '0.0"%"'; tr.getCell(8).font = { ...boldFont, size: 12, color: { argb: 'FF1F4E79' } };
  tr.getCell(8).fill = ACCENT_FILL; tr.getCell(8).alignment = { horizontal: 'center', vertical: 'middle' }; tr.getCell(8).border = thinBorder;
  tr.getCell(9).value = { formula: '=REPT("█",ROUND(H28*10,0))&" "&TEXT(H28,"0.0%")' }; tr.getCell(9).font = { name: 'Consolas', size: 12, bold: true, color: { argb: 'FF1F4E79' } };
  tr.getCell(9).fill = ACCENT_FILL; tr.getCell(9).alignment = { vertical: 'middle' }; tr.getCell(9).border = thinBorder;
  tr.getCell(10).value = 'Progress total berbobot'; tr.getCell(10).font = { name: 'Calibri', size: 10, italic: true }; tr.getCell(10).fill = ACCENT_FILL; tr.getCell(10).alignment = { vertical: 'middle' }; tr.getCell(10).border = thinBorder;

  // Auto filter
  ws.autoFilter = { from: 'A11', to: 'J27' };

  // Data validation: Status dropdown
  for (let r = 12; r <= 27; r++) {
    ws.getCell(`G${r}`).dataValidation = {
      type: 'list',
      allowBlank: false,
      formulae: ['"Belum Mulai,Berjalan,Selesai,Tertunda,Revisi"'],
      showDropDown: false,
      showErrorMessage: true,
      errorTitle: 'Status tidak valid',
      error: 'Pilih: Belum Mulai, Berjalan, Selesai, Tertunda, Revisi',
    };
    ws.getCell(`H${r}`).dataValidation = {
      type: 'decimal',
      operator: 'between',
      allowBlank: false,
      formulae: [0, 1],
      showErrorMessage: true,
      errorTitle: 'Progress tidak valid',
      error: 'Isi 0% sampai 100% (mis. 50%)',
      promptTitle: 'Progress',
      prompt: 'Isi 0% - 100%',
      showInputMessage: true,
    };
  }

  // Conditional formatting: DataBar untuk H12:H27
  ws.addConditionalFormatting({
    ref: 'H12:H27',
    rules: [
      {
        type: 'dataBar',
        priority: 1,
        cfvo: [
          { type: 'min', value: 0 },
          { type: 'max', value: 1 },
        ],
        color: { argb: 'FF2E75B6' },
      },
    ],
  });

  // Print setup
  ws.pageSetup.fitToPage = true;
  ws.pageSetup.fitToWidth = 1;
  ws.pageSetup.fitToHeight = 1;
  ws.printTitleRow = '11:11';

  const outPath = path.join(__dirname, 'Dashboard-Progress-Aplikasi-Android.xlsx');
  await wb.xlsx.writeFile(outPath);
  console.log('OK:' + outPath);
}

main().catch(e => { console.error('ERR:' + (e.stack || e.message)); process.exit(1); });
