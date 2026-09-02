import Link from "next/link";
import { BadgeList } from "@/components/BadgeList";
import { Poster } from "@/components/Poster";
import { PosterSheet } from "@/components/PosterSheet";
import { loadLedger } from "@/lib/queries";
import { formatNightDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { nights, films, people, crusades } = await loadLedger();
  const latest = nights[0];
  const mostWatched = [...films]
    .sort((a, b) => b.stats.watchedCount - a.stats.watchedCount)
    .slice(0, 8);
  const mostPicked = [...films].sort((a, b) => b.stats.pickCount - a.stats.pickCount).slice(0, 8);
  const golden = [...people].sort((a, b) => b.stats.goldenChild - a.stats.goldenChild).slice(0, 6);
  const topCrusades = crusades.slice(0, 4);
  const active = crusades.filter((c) => c.active);
  const members = people.filter((p) => p.verified).length;

  return (
    <div className="space-y-8">
      {!latest ? (
        <div className="rounded-2xl bg-bg2 px-4 py-5 text-sm leading-6 text-muted">
          The System is live. The Log is not attached yet. Nights appear after Neon is connected.
        </div>
      ) : null}
      {latest ? (
        <Link href={`/nights/${latest.id}`} className="block overflow-hidden rounded-2xl bg-bg2">
          <div className="grid sm:grid-cols-[160px_1fr]">
            <div className="mx-auto w-36 pt-5 sm:mx-0 sm:w-full sm:pt-0">
              <Poster
                title={latest.watchedFilm.title}
                year={latest.watchedFilm.year}
                posterPath={latest.watchedFilm.posterPath}
                className="rounded-xl sm:rounded-none"
              />
            </div>
            <div className="flex flex-col justify-center px-5 py-5">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">Last session</p>
              <h2 className="mt-1 text-3xl font-semibold tracking-tight">{latest.watchedFilm.title}</h2>
              <p className="mt-2 text-sm text-muted">
                {formatNightDate(latest.date)}
                {" · "}
                {latest.unanimous
                  ? "Unanimous"
                  : `Golden Child ${latest.goldenChild?.name ?? "unrecorded"}`}
              </p>
              <p className="mt-3 text-sm leading-6 text-paper/80">
                {latest.notes || "Entered in The Log. No further remark."}
              </p>
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-2xl bg-bg2 p-6 text-muted">The Log is empty.</div>
      )}

      <section className="grid grid-cols-3 gap-2">
        <Link href="/archive" className="rounded-2xl bg-bg2 px-3 py-4">
          <p className="text-2xl font-semibold">{nights.length}</p>
          <p className="mt-1 text-xs text-muted">Sessions</p>
        </Link>
        <Link href="/people" className="rounded-2xl bg-bg2 px-3 py-4">
          <p className="text-2xl font-semibold">{members}</p>
          <p className="mt-1 text-xs text-muted">Members</p>
        </Link>
        <Link href="/archive" className="rounded-2xl bg-bg2 px-3 py-4">
          <p className="text-2xl font-semibold">{active.length}</p>
          <p className="mt-1 text-xs text-muted">Crusades</p>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <h3 className="text-lg font-semibold">Most watched</h3>
          <Link href="/films" className="text-sm text-cta">
            Films
          </Link>
        </div>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {mostWatched.map((film) => (
            <div key={film.id} className="w-28 shrink-0">
              <div className="overflow-hidden rounded-xl bg-bg3">
                <PosterSheet film={film} posterPath={film.posterPath} />
              </div>
              <Link href={`/films/${film.slug}`} className="mt-2 block truncate text-sm font-medium">
                {film.title}
              </Link>
              <p className="text-xs text-muted">{film.stats.watchedCount} screenings</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Most nominated</h3>
        <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {mostPicked.map((film) => (
            <div key={film.id} className="w-28 shrink-0">
              <div className="overflow-hidden rounded-xl bg-bg3">
                <PosterSheet film={film} posterPath={film.posterPath} />
              </div>
              <Link href={`/films/${film.slug}`} className="mt-2 block truncate text-sm font-medium">
                {film.title}
              </Link>
              <p className="text-xs text-muted">{film.stats.pickCount} picks</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Golden Children</h3>
        <div className="grid gap-2">
          {golden.map((person) => (
            <Link key={person.id} href={`/people/${person.slug}`} className="rounded-2xl bg-bg2 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <p className="font-medium">{person.name}</p>
                <p className="text-sm text-muted">{person.stats.goldenChild}</p>
              </div>
              <div className="mt-2">
                <BadgeList badges={person.badges} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Crusades</h3>
        <div className="grid gap-2">
          {topCrusades.map((c) => (
            <Link
              key={`${c.personId}-${c.filmId}-${c.length}-${c.active}`}
              href={`/films/${c.filmSlug}`}
              className="rounded-2xl bg-bg2 px-4 py-4"
            >
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                {c.active ? "Open" : "Closed"} · {c.length} sessions
              </p>
              <p className="mt-1 font-medium">
                {c.personName} · {c.filmTitle}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
