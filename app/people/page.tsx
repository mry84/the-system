import Link from "next/link";
import { BadgeList } from "@/components/BadgeList";
import { loadLedger } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function PeoplePage() {
  const { people } = await loadLedger();
  const roster = [...people].sort((a, b) => {
    if (a.isFounding !== b.isFounding) return a.isFounding ? -1 : 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Members</h2>
      <ul className="grid gap-2">
        {roster.map((person) => (
          <li key={person.id}>
            <Link href={`/people/${person.slug}`} className="block rounded-2xl bg-bg2 px-4 py-4">
              <p className="font-medium">{person.name}</p>
              <p className="mt-1 text-xs text-muted">
                {person.isFounding ? "Founding \u00b7 " : person.verified ? "" : "Pending \u00b7 "}
                {person.stats.nights} nights \u00b7 Golden Child {person.stats.goldenChild}
              </p>
              <div className="mt-3">
                <BadgeList badges={person.badges} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
