import Link from "next/link";
import { PosterSheet } from "@/components/PosterSheet";
import { loadLedger } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function FilmsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const { films } = await loadLedger();
  const filtered = films
    .filter((film) => !q || `${film.title} ${film.year}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.stats.pickCount - a.stats.pickCount || a.title.localeCompare(b.title));

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold tracking-tight">Films</h2>
      <form>
        <input name="q" defaultValue={q} placeholder="Search films" className="rounded-xl" />
      </form>
      <p className="text-sm text-muted">{filtered.length} titles in The Log</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {filtered.map((film) => (
          <li key={film.id}>
            <Link href={`/films/${film.slug}`} className="block">
              <div className="overflow-hidden rounded-xl bg-bg3">
                <PosterSheet film={film} posterPath={film.posterPath} />
              </div>
              <p className="mt-2 truncate text-sm font-medium">{film.title}</p>
              <p className="text-xs text-muted">
                {film.year} \u00b7 {film.stats.pickCount} picks \u00b7 {film.stats.watchedCount} screened
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
