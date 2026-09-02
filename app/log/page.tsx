import { LogForm } from "@/components/LogForm";
import { loadLedger } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function LogPage() {
  const { people } = await loadLedger();
  const roster = people.filter((person: { verified: boolean }) => person.verified);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-semibold tracking-tight">The Log</h2>
        <p className="mt-3 text-sm text-muted">When. Who. What. What. What.</p>
      </div>
      <LogForm people={roster} />
    </div>
  );
}
