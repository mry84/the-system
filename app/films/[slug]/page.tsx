import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeList } from "@/components/BadgeList";
import { PosterSheet } from "@/components/PosterSheet";
import { filmLinks } from "@/lib/film-links";
import { loadLedger } from "@/lib/queries";
import { formatNightDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function FilmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { films, nights, crusades } = await loadLedger();
  const film = films.find((f) => f.slug === slug);
  if (!film) notFound();
  const appearances = nights.filter((n) => n.watchedFilmId === film.id || n.finalists.some((f) => f.filmId === film.id) || n.picks.some((p) => p.filmId === film.id));
  const filmCrusades = crusades.filter((c) => c.filmId === film.id);
  return (
    <div className="grid gap-10 lg:grid-cols-[240px_1fr]">
      <div className="overflow-hidden rounded-2xl bg-bg2"><PosterSheet film={film} posterPath={film.posterPath} /></div>
      <div className="space-y-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">{film.year}</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight">{film.title}</h2>
          <div className="mt-4"><BadgeList badges={film.badges} /></div>
          <p className="mt-4 text-sm text-muted">Picked {film.stats.pickCount} times · Finalist {film.stats.finalistCount} · Watched {film.stats.watchedCount}</p>
          <div className="mt-4 grid gap-2">
            {filmLinks(film).filter((link) => link.external).map((link) => (
              <a key={link.label} href={link.href} target="_blank" rel="noreferrer" className="flex min-h-12 items-center rounded-xl bg-bg2 px-4 text-sm">{link.label}</a>
            ))}
          </div>
        </div>
        {filmCrusades.length ? (
          <section>
            <h3 className="text-2xl font-semibold">Crusades</h3>
            <ul className="mt-3 space-y-2 text-sm">
              {filmCrusades.map((c) => (
                <li key={`${c.personId}-${c.length}`}>
                  <Link href={`/people/${c.personSlug}`} className="text-cta hover:underline">{c.personName}</Link> · {c.length} nights {c.active ? "(open)" : ""}
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        <section>
          <h3 className="text-2xl font-semibold">Nights</h3>
          <ul className="mt-3 divide-y divide-line">
            {appearances.map((night) => (
              <li key={night.id} className="py-3">
                <Link href={`/nights/${night.id}`} className="hover:text-cta">{formatNightDate(night.date)}{night.watchedFilmId === film.id ? " · watched" : ""}</Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
