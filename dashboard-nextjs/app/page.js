import Dashboard from "@/components/Dashboard";

async function getData() {
  // Saat build/prerender, baca langsung dari store agar tidak perlu fetch HTTP
  const { readStore } = await import("@/lib/store");
  const { TASKS, GROUPS } = await import("@/lib/data");
  const store = await readStore();
  return { tasks: TASKS, groups: GROUPS, values: store.values };
}

export const dynamic = "force-dynamic";

export default async function Page() {
  const initial = await getData();
  return <Dashboard initial={initial} />;
}
