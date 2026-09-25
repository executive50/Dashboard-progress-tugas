import fs from "node:fs";
import path from "node:path";
import { TASKS, GROUPS, SEED_K1, blankCell } from "./data";

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "progress.json");
const KV_KEY = "progress:store:v1";

function defaultValues() {
  const values = {};
  for (const g of GROUPS) {
    values[g.id] = {};
    for (const t of TASKS) {
      if (g.id === "k1" && SEED_K1[t.id]) values[g.id][t.id] = { ...SEED_K1[t.id] };
      else values[g.id][t.id] = blankCell();
    }
  }
  return values;
}

// Pastikan struktur lengkap (tahan jika TASKS bertambah)
function ensureShape(json) {
  if (!json || typeof json !== "object") return { updatedAt: new Date().toISOString(), values: defaultValues() };
  json.values = json.values || {};
  for (const g of GROUPS) {
    json.values[g.id] = json.values[g.id] || {};
    for (const t of TASKS) json.values[g.id][t.id] = json.values[g.id][t.id] || blankCell();
  }
  return json;
}

function readFileStore() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      const init = { updatedAt: new Date().toISOString(), values: defaultValues() };
      fs.writeFileSync(DATA_FILE, JSON.stringify(init, null, 2));
      return init;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return ensureShape(JSON.parse(raw));
  } catch {
    return { updatedAt: new Date().toISOString(), values: defaultValues() };
  }
}

function writeFileStore(values) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const out = { updatedAt: new Date().toISOString(), values };
  fs.writeFileSync(DATA_FILE, JSON.stringify(out, null, 2));
  return out;
}

function kvConfigured() {
  return !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

function upstashConfigured() {
  return !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

// REST API Upstash (tanpa dependency tambahan, aman di serverless)
async function upstashCmd(cmd) {
  const base = process.env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "");
  const res = await fetch(base, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  if (!res.ok) throw new Error("Upstash HTTP " + res.status);
  const j = await res.json();
  if (j.error) throw new Error("Upstash: " + j.error);
  return j.result;
}

function redisUrlConfigured() {
  return !!process.env.REDIS_URL;
}

let redisClient = null;
async function getRedis() {
  if (redisClient && redisClient.isOpen) return redisClient;
  const { createClient } = await import("redis");
  redisClient = createClient({ url: process.env.REDIS_URL });
  redisClient.on("error", () => {});
  await redisClient.connect();
  return redisClient;
}

async function readRemote() {
  if (redisUrlConfigured()) {
    const client = await getRedis();
    const raw = await client.get(KV_KEY);
    return raw ? JSON.parse(raw) : null;
  }
  if (kvConfigured()) {
    const { kv } = await import("@vercel/kv");
    return await kv.get(KV_KEY);
  }
  if (upstashConfigured()) {
    const raw = await upstashCmd(["GET", KV_KEY]);
    return raw ? JSON.parse(raw) : null;
  }
  return undefined; // tidak ada database -> pakai file
}

async function writeRemote(out) {
  if (redisUrlConfigured()) {
    const client = await getRedis();
    await client.set(KV_KEY, JSON.stringify(out));
    return true;
  }
  if (kvConfigured()) {
    const { kv } = await import("@vercel/kv");
    await kv.set(KV_KEY, out);
    return true;
  }
  if (upstashConfigured()) {
    await upstashCmd(["SET", KV_KEY, JSON.stringify(out)]);
    return true;
  }
  return false;
}

// Di Vercel (ada env Redis) -> database bersama. Di localhost -> file lokal.
export async function readStore() {
  if (redisUrlConfigured() || kvConfigured() || upstashConfigured()) {
    try {
      const data = await readRemote();
      if (data && data.values) return ensureShape(data);
      // pertama kali: seed dari default lalu simpan
      const init = { updatedAt: new Date().toISOString(), values: defaultValues() };
      await writeRemote(init);
      return init;
    } catch (e) {
      console.error("Remote read gagal, pakai file:", e?.message);
    }
  }
  return readFileStore();
}

export async function writeStore(values) {
  const out = { updatedAt: new Date().toISOString(), values };
  if (redisUrlConfigured() || kvConfigured() || upstashConfigured()) {
    try {
      await writeRemote(out);
      return out;
    } catch (e) {
      console.error("Remote write gagal, pakai file:", e?.message);
    }
  }
  return writeFileStore(values);
}
