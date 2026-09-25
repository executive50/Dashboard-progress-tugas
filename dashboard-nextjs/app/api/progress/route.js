import { NextResponse } from "next/server";
import { TASKS, GROUPS } from "@/lib/data";
import { readStore, writeStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({ tasks: TASKS, groups: GROUPS, values: store.values, updatedAt: store.updatedAt });
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { groupId, taskId, patch } = body || {};
    if (!groupId || !taskId || !patch) {
      return NextResponse.json({ error: "groupId, taskId, patch wajib" }, { status: 400 });
    }
    const store = await readStore();
    if (!store.values[groupId]?.[taskId]) {
      return NextResponse.json({ error: "ID tidak dikenal" }, { status: 404 });
    }
    const cur = store.values[groupId][taskId];
    const next = { ...cur };
    if (patch.status !== undefined) next.status = String(patch.status);
    if (patch.progress !== undefined) {
      let p = Math.round(Number(patch.progress));
      if (Number.isNaN(p)) p = 0;
      next.progress = Math.max(0, Math.min(100, p));
      if (next.progress >= 100) next.status = "Selesai";
      else if (next.progress > 0 && cur.status === "Belum Mulai") next.status = "Berjalan";
    }
    if (patch.ket !== undefined) next.ket = String(patch.ket).slice(0, 200);
    if (patch.pic !== undefined) next.pic = String(patch.pic).slice(0, 40);
    store.values[groupId][taskId] = next;
    const saved = await writeStore(store.values);
    return NextResponse.json({ ok: true, cell: next, updatedAt: saved.updatedAt });
  } catch (e) {
    return NextResponse.json({ error: "Gagal menyimpan" }, { status: 500 });
  }
}
