"use client";
import { useMemo, useState } from "react";
import { STATUSES, weightedTotal } from "@/lib/data";

const pill = (s) =>
  s === "Selesai" ? "bg-green-100 text-green-800"
  : s === "Berjalan" ? "bg-yellow-100 text-yellow-800"
  : s === "Tertunda" || s === "Revisi" ? "bg-red-100 text-red-700"
  : "bg-slate-200 text-slate-600";

export default function Dashboard({ initial }) {
  const [tasks] = useState(initial.tasks);
  const [groups] = useState(initial.groups);
  const [values, setValues] = useState(initial.values);
  const [active, setActive] = useState("k1");
  const [fCat, setFCat] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [q, setQ] = useState("");
  const [saving, setSaving] = useState("");

  const cells = values[active] || {};
  const cats = useMemo(() => [...new Set(tasks.map((t) => t.kategori))], [tasks]);

  const total = weightedTotal(tasks, cells);
  const done = tasks.filter((t) => cells[t.id]?.status === "Selesai").length;
  const run = tasks.filter((t) => cells[t.id]?.status === "Berjalan").length;
  const todo = tasks.filter((t) => cells[t.id]?.status === "Belum Mulai").length;
  const late = tasks.length - done - run - todo;

  const ranking = useMemo(
    () => groups.map((g) => ({ ...g, total: weightedTotal(tasks, values[g.id]) })).sort((a, b) => b.total - a.total),
    [groups, tasks, values]
  );

  async function update(taskId, patch) {
    // optimistic
    setValues((v) => ({ ...v, [active]: { ...v[active], [taskId]: { ...v[active][taskId], ...patch } } }));
    setSaving(taskId + JSON.stringify(patch));
    try {
      await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ groupId: active, taskId, patch }),
      });
    } finally {
      setSaving("");
    }
  }

  const rows = tasks.filter((t) => {
    if (fCat && t.kategori !== fCat) return false;
    if (fStatus && cells[t.id]?.status !== fStatus) return false;
    if (q && !(t.modul + t.kategori + (cells[t.id]?.pic || "")).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const gName = groups.find((g) => g.id === active)?.name;

  return (
    <div className="min-h-screen">
      <header className="bg-[#1F4E79] text-white px-6 py-5">
        <h1 className="text-xl font-bold">📊 Progress Tugas Pembuatan Aplikasi Mobile — Kelas 06TPLP003</h1>
      </header>

      <main className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Pilih kelompok */}
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-xs font-bold tracking-wide text-slate-500 mb-2">PILIH KELOMPOK (11 KELOMPOK — KLIK UNTUK UPDATE)</p>
          <div className="flex flex-wrap gap-2">
            {groups.map((g) => {
              const t = weightedTotal(tasks, values[g.id]);
              const on = g.id === active;
              return (
                <button key={g.id} onClick={() => setActive(g.id)}
                  className={`px-3 py-2 rounded-lg border text-sm font-semibold ${on ? "bg-[#1F4E79] text-white border-[#1F4E79]" : "bg-slate-50 hover:bg-slate-100 border-slate-200"}`}>
                  {g.name} <span className={`ml-1 text-xs ${on ? "text-sky-200" : "text-slate-500"}`}>{t.toFixed(0)}%</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <div className="bg-[#DDEBF7] rounded-xl p-4 text-center border"><p className="text-[11px] font-bold text-slate-500">{gName?.toUpperCase()} — TOTAL</p><p className="text-3xl font-extrabold text-[#1F4E79]">{total.toFixed(1)}%</p>
            <div className="h-2 bg-white rounded-full mt-2 overflow-hidden"><div className="h-full bg-[#2E75B6]" style={{ width: `${Math.min(100, total)}%` }} /></div></div>
          <div className="bg-green-50 rounded-xl p-4 text-center border border-green-200"><p className="text-[11px] font-bold text-slate-500">SELESAI</p><p className="text-3xl font-extrabold text-green-700">{done}</p></div>
          <div className="bg-yellow-50 rounded-xl p-4 text-center border border-yellow-200"><p className="text-[11px] font-bold text-slate-500">BERJALAN</p><p className="text-3xl font-extrabold text-yellow-700">{run}</p></div>
          <div className="bg-slate-50 rounded-xl p-4 text-center border"><p className="text-[11px] font-bold text-slate-500">BELUM</p><p className="text-3xl font-extrabold">{todo}</p></div>
          <div className="bg-red-50 rounded-xl p-4 text-center border border-red-200"><p className="text-[11px] font-bold text-slate-500">TERTUNDA</p><p className="text-3xl font-extrabold text-red-700">{late}</p></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Tabel spreadsheet */}
          <div className="md:col-span-2 bg-white rounded-xl shadow p-4">
            <div className="flex flex-wrap gap-2 mb-3">
              <select value={fCat} onChange={(e) => setFCat(e.target.value)} className="border rounded-md px-2 py-1.5 text-sm">
                <option value="">Semua Kategori</option>{cats.map((c) => <option key={c}>{c}</option>)}
              </select>
              <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} className="border rounded-md px-2 py-1.5 text-sm">
                <option value="">Semua Status</option>{STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="🔍 Cari modul / PIC..." className="border rounded-md px-2 py-1.5 text-sm flex-1 min-w-[160px]" />
              {saving && <span className="text-xs text-slate-400 self-center">menyimpan…</span>}
            </div>
            <div className="overflow-auto max-h-[560px] border rounded-lg">
              <table className="w-full text-[13px]">
                <thead className="sticky top-0"><tr className="bg-[#1F4E79] text-white">
                  <th className="p-2 text-left">Modul / Bobot / Target</th><th className="p-2">Status</th><th className="p-2">Progress</th><th className="p-2 text-left min-w-[170px]">Bar</th>
                </tr></thead>
                <tbody>
                  {rows.map((t, i) => {
                    const c = cells[t.id] || {};
                    return (
                      <tr key={t.id} className={i % 2 ? "bg-slate-50" : ""}>
                        <td className="p-2 border-t">
                          <p className="font-semibold">{i + 1}. {t.modul}</p>
                          <p className="text-xs text-slate-500">{t.kategori} • {t.bobot}% • 🎯 {t.target}</p>
                          <div className="flex gap-1 mt-1">
                            <input defaultValue={c.pic} key={active + t.id + "pic"} onBlur={(e) => e.target.value !== c.pic && update(t.id, { pic: e.target.value })}
                              className="border rounded px-1.5 py-0.5 text-xs w-24" placeholder="PIC" title="PIC" />
                            <input defaultValue={c.ket} key={active + t.id + "ket"} onBlur={(e) => e.target.value !== c.ket && update(t.id, { ket: e.target.value })}
                              className="border rounded px-1.5 py-0.5 text-xs flex-1" placeholder="Keterangan" title="Keterangan" />
                          </div>
                        </td>
                        <td className="p-2 border-t text-center">
                          <select value={c.status} onChange={(e) => update(t.id, { status: e.target.value })} className="border rounded-md text-xs px-1.5 py-1">
                            {STATUSES.map((s) => <option key={s}>{s}</option>)}
                          </select>
                          <div className="mt-1"><span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${pill(c.status)}`}>{c.status}</span></div>
                        </td>
                        <td className="p-2 border-t text-center">
                          <input type="range" min="0" max="100" value={c.progress || 0} onChange={(e) => update(t.id, { progress: e.target.value })} className="w-24 accent-[#2E75B6]" />
                          <p className="font-extrabold text-[#1F4E79]">{c.progress}%</p>
                        </td>
                        <td className="p-2 border-t">
                          <div className="h-3.5 bg-slate-200 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${c.progress >= 100 ? "bg-green-500" : "bg-gradient-to-r from-[#2E75B6] to-sky-400"}`} style={{ width: `${c.progress || 0}%` }} />
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 font-mono">{"█".repeat(Math.round((c.progress || 0) / 10))} {c.progress}%</p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-slate-500 mt-2">Total {gName} = Σ(bobot × progress) = <b>{total.toFixed(1)}%</b> • Bobot tasks = 100% • Edit PIC/keterangan lalu klik di luar kolom untuk simpan.</p>
          </div>

          {/* Peringkat + rekap */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold mb-2">🏆 Peringkat 11 Kelompok</h3>
              <div className="space-y-1.5">
                {ranking.map((g, i) => (
                  <button key={g.id} onClick={() => setActive(g.id)} className={`w-full text-left px-2.5 py-1.5 rounded-lg border ${g.id === active ? "border-[#1F4E79] bg-sky-50" : "border-slate-100"}`}>
                    <div className="flex justify-between text-sm"><span className="font-semibold">{i + 1}. {g.name}</span><span className="font-extrabold text-[#1F4E79]">{g.total.toFixed(1)}%</span></div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1"><div className="h-full bg-[#2E75B6]" style={{ width: `${g.total}%` }} /></div>
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-bold mb-2">Rekap Kategori — {gName}</h3>
              <div className="grid grid-cols-2 gap-2">
                {cats.map((c) => {
                  const list = tasks.filter((t) => t.kategori === c);
                  const avg = list.reduce((a, t) => a + (+cells[t.id]?.progress || 0), 0) / (list.length || 1);
                  const dn = list.filter((t) => cells[t.id]?.status === "Selesai").length;
                  return (
                    <div key={c} className="border rounded-lg p-2 bg-slate-50">
                      <p className="text-xs font-bold">{c}</p>
                      <p className="text-[11px] text-slate-500">{dn}/{list.length} • {avg.toFixed(0)}%</p>
                      <div className="h-1.5 bg-slate-200 rounded-full mt-1 overflow-hidden"><div className="h-full bg-[#2E75B6]" style={{ width: `${avg}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 pb-6">Data tersimpan di <code>data/progress.json</code> via API <code>/api/progress</code> • Jalankan <code>npm run dev</code> lalu buka localhost:3000</p>
      </main>
    </div>
  );
}
