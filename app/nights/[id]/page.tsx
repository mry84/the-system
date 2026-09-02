import Link from "next/link";
import { notFound } from "next/navigation";
import { PosterSheet } from "@/components/PosterSheet";
import { loadLedger } from "@/lib/queries";
import { formatNightDate } from "@/lib/slug";

export const dynamic = "force-dynamic";

export default async function NightPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { nights } = await loadLedger();
  const night = nights.find((n: { id: string }) => n.id === id);
  if (!night) notFound();

  const picksByPerson = new Map<string, typeof night.picks>();
  for (const pick of night.picks) {
    const list = picksByPerson.get(pick.personId) ?? [];
    list.push(pick);
    picksByPerson.set(pick.personId, list);
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted">
          {formatNightDate(night.date)}
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight">{night.watchedFilm.title}</h2>
        <p className="mt-2 text-muted">
          {night.unanimous ? (
            "Unanimous"
          ) : night.goldenChild ? (
            <>
              Golden Child{" "}
              <Link href={`/people/${night.goldenChild.slug}`} className="text-cta">
                {night.goldenChild.name}
              </Link>
            </>
          ) : (
            "Golden Child unrecorded"
          )}
        </p>
      </div>

      <section className="grid gap-6 sm:grid-cols-2">
        {night.finalists.map((finalist: any) => {
          const watched = finalist.filmId === night.watchedFilmId;
          return (
            <div key={finalist.filmId}>
              <div className="overflow-hidden rounded-xl bg-bg2">
                <PosterSheet film={finalist.film} posterPath={finalist.film.posterPath} />
              </div>
              <Link href={`/films/${finalist.film.slug}`} className="mt-3 block">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  {watched ? "Screened" : "Finalist"}
                </p>
                <p className="text-2xl font-semibold">
                  {finalist.film.title}{" "}
                  <span className="text-base text-muted">({finalist.film.year})</span>
                </p>
              </Link>
            </div>
          );
        })}
      </section>

      {night.notes ? (
        <p className="max-w-2xl text-lg leading-8 text-paper/85">{night.notes}</p>
      ) : null}

      <section>
        <h3 className="text-2xl font-semibold">The room</h3>
        <ul className="mt-4 divide-y divide-line">
          {night.attendees.map((row: any) => (
            <li key={row.personId} className="py-4">
              <Link href={`/people/${row.person.slug}`} className="text-cta hover:underline">
                {row.person.name}
              </Link>
              {row.personId === night.goldenChildId ? (
                <span className="ml-2 text-[10px] uppercase tracking-[0.16em] text-cta">Golden Child</span>
              ) : null}
              <ul className="mt-2 text-sm text-muted">
                {(picksByPerson.get(row.personId) ?? []).map((pick: any) => (
                  <li key={pick.id}>
                    {pick.weight} pick{pick.weight > 1 ? "s" : ""} on{" "}
                    <Link href={`/films/${pick.film.slug}`} className="text-paper hover:text-cta">
                      {pick.film.title} ({pick.film.year})
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
