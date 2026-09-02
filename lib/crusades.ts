import type { Crusade } from "./types";

type NightSlice = {
  id: string;
  date: Date;
  goldenChildId: string | null;
  watchedFilmId: string;
  attendees: { personId: string }[];
  picks: { personId: string; filmId: string; weight: number }[];
};

type PersonRef = { id: string; name: string; slug: string };
type FilmRef = {
  id: string;
  title: string;
  year: number;
  slug: string;
  posterPath: string | null;
};

export function computeCrusades(
  nights: NightSlice[],
  people: PersonRef[],
  films: FilmRef[],
): Crusade[] {
  const personById = new Map(people.map((p) => [p.id, p]));
  const filmById = new Map(films.map((f) => [f.id, f]));
  const ordered = [...nights].sort((a, b) => a.date.getTime() - b.date.getTime());

  const runs: Crusade[] = [];

  for (const person of people) {
    const attended = ordered.filter((n) =>
      n.attendees.some((a) => a.personId === person.id),
    );

    let current: { filmId: string; length: number } | null = null;

    const close = (active: boolean) => {
      if (!current) return;
      const film = filmById.get(current.filmId);
      const member = personById.get(person.id);
      if (!film || !member) return;
      runs.push({
        personId: member.id,
        personName: member.name,
        personSlug: member.slug,
        filmId: film.id,
        filmTitle: film.title,
        filmYear: film.year,
        filmSlug: film.slug,
        posterPath: film.posterPath,
        length: current.length,
        active,
      });
    };

    for (const night of attended) {
      const isGc = night.goldenChildId === person.id;
      const personPicks = night.picks.filter((p) => p.personId === person.id);
      const pickedWatched = personPicks.some((p) => p.filmId === night.watchedFilmId);

      if (isGc || pickedWatched) {
        close(false);
        current = null;
        continue;
      }

      const titles = [...new Set(personPicks.map((p) => p.filmId))];
      if (titles.length === 0) {
        close(false);
        current = null;
        continue;
      }

      if (current && titles.includes(current.filmId)) {
        current.length += 1;
        continue;
      }

      close(false);
      current = { filmId: titles[0], length: 1 };
    }

    close(true);
  }

  return runs.filter((r) => r.length >= 3);
}
