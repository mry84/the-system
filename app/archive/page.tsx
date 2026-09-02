import Link from "next/link";
import { loadLedger } from "@/lib/queries";
import { formatNightDate } from "@/lib/slug";
import { nightVerdict, otherFinalist } from "@/lib/verdict";

export const dynamic = "force-dynamic";

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; year?: string; person?: string }>;
}) {
  const { q = "", year = "", person = "" } = await searchParams;
  const { nights, people } = await loadLedger();
  const years = [...new Set(nights.map((n) => n.date.getUTCFullYear()))].sort((a, b) => b - a);

  const filtered = nights.filter((night) => {
    const hay = [
      night.watchedFilm.title,
      night.goldenChild?.name ?? "",
      night.unanimous ? "unanimous" : "",
      night.notes ?? "",
      ...night.attendees.map((a: { person: { name: string } }) => a.person.name),
      ...night.picks.map((p: { film: { title: string } }) => p.film.title),
      ...night.finalists.map((f: { film: { title: string } }) => f.film.title),
    ]
      .join(" ")
      .toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (year && night.date.getUTCFullYear() !== Number(year)) return false;
    if (person && !night.attendees.some((a: { person: { slug: string } }) => a.person.slug === person)) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Archive</h2>
      <form className="grid gap-2">
        <input name="q" defaultValue={q} placeholder="Search The Log" className="rounded-xl" />
        <div className="grid grid-cols-2 gap-2">
          <select name="year" defaultValue={year} className="rounded-xl">
            <option value="">All years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select name="person" defaultValue={person} className="rounded-xl">
            <option value="">Any member</option>
            {people.map((p: { id: string; slug: string; name: string }) => (
              <option key={p.id} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <button className="rounded-xl bg-cta text-sm font-semibold text-white">Apply</button>
      </form>
      <p className="text-sm text-muted">{filtered.length} sessions</p>
      <ul className="grid gap-2">
        {filtered.map((night) => {
          const other = otherFinalist(night);
          return (
            <li key={night.id}>
              <Link href={`/nights/${night.id}`} className="block rounded-2xl bg-bg2 px-4 py-4">
                <p className="text-xs text-muted">{formatNightDate(night.date)}</p>
                <p className="mt-1 text-lg font-semibold leading-6">{nightVerdict(night)}</p>
                {other ? (
                  <p className="mt-1 text-sm text-muted">
                    {night.watchedFilm.title} / {other.title}
                  </p>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
