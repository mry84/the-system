import { prisma } from "./prisma";
import { buildDemoRaw } from "./demo-ledger";
import { computeCrusades } from "./crusades";
import {
  currentCrusade,
  filmAutoBadges,
  longestCrusade,
  personAutoBadges,
} from "./badges";
import type { FilmLedgerStats } from "./types";

export async function loadLedger() {
  try {
    const raw = process.env.DATABASE_URL
      ? {
          people: await prisma.person.findMany({ orderBy: { name: "asc" } }),
          films: await prisma.film.findMany({ orderBy: [{ title: "asc" }, { year: "asc" }] }),
          nights: await prisma.systemNight.findMany({
            orderBy: { date: "desc" },
            include: {
              goldenChild: true,
              watchedFilm: true,
              attendees: { include: { person: true } },
              picks: { include: { person: true, film: true } },
              finalists: { include: { film: true } },
            },
          }),
        }
      : buildDemoRaw();
    const { people, films, nights } = raw as any;

    const crusades = computeCrusades(
      nights.map((n: any) => ({
        id: n.id,
        date: n.date,
        goldenChildId: n.goldenChildId,
        watchedFilmId: n.watchedFilmId,
        attendees: n.attendees.map((a: any) => ({ personId: a.personId })),
        picks: n.picks.map((p: any) => ({
          personId: p.personId,
          filmId: p.filmId,
          weight: p.weight,
        })),
      })),
      people,
      films,
    );

    const pickCounts = new Map<string, { count: number; weight: number }>();
    const watchedCounts = new Map<string, number>();
    const finalistCounts = new Map<string, number>();
    const gcCounts = new Map<string, number>();
    const attendanceCounts = new Map<string, number>();

    for (const film of films) {
      pickCounts.set(film.id, { count: 0, weight: 0 });
      watchedCounts.set(film.id, 0);
      finalistCounts.set(film.id, 0);
    }
    for (const person of people) {
      gcCounts.set(person.id, 0);
      attendanceCounts.set(person.id, 0);
    }

    for (const night of nights) {
      watchedCounts.set(night.watchedFilmId, (watchedCounts.get(night.watchedFilmId) ?? 0) + 1);
      if (night.goldenChildId) {
        gcCounts.set(night.goldenChildId, (gcCounts.get(night.goldenChildId) ?? 0) + 1);
      }
      for (const a of night.attendees) {
        attendanceCounts.set(a.personId, (attendanceCounts.get(a.personId) ?? 0) + 1);
      }
      for (const f of night.finalists) {
        finalistCounts.set(f.filmId, (finalistCounts.get(f.filmId) ?? 0) + 1);
      }
      for (const p of night.picks) {
        const row = pickCounts.get(p.filmId) ?? { count: 0, weight: 0 };
        row.count += 1;
        row.weight += p.weight;
        pickCounts.set(p.filmId, row);
      }
    }

    const pickCountValues = [...pickCounts.values()].map((v) => v.count).sort((a, b) => b - a);
    const heavyNomineeCutoff = pickCountValues[Math.min(7, pickCountValues.length - 1)] ?? 99;

    function filmStats(filmId: string): FilmLedgerStats {
      const picks = pickCounts.get(filmId) ?? { count: 0, weight: 0 };
      return {
        pickCount: picks.count,
        pickWeight: picks.weight,
        watchedCount: watchedCounts.get(filmId) ?? 0,
        finalistCount: finalistCounts.get(filmId) ?? 0,
        crusadeCount: crusades.filter((c) => c.filmId === filmId).length,
        activeCrusade: crusades.some((c) => c.filmId === filmId && c.active),
      };
    }

    const filmsWithBadges = films.map((film: any) => {
      const stats = filmStats(film.id);
      return { ...film, stats, badges: filmAutoBadges(film, stats, heavyNomineeCutoff) };
    });

    const peopleWithBadges = people.map((person: any) => {
      const stats = {
        nights: attendanceCounts.get(person.id) ?? 0,
        goldenChild: gcCounts.get(person.id) ?? 0,
        currentCrusade: currentCrusade(crusades, person.id),
        longestCrusade: longestCrusade(crusades, person.id),
      };
      return { ...person, stats, badges: personAutoBadges(person, stats) };
    });

    return {
      people: peopleWithBadges,
      films: filmsWithBadges,
      nights,
      crusades: [...crusades].sort((a, b) => b.length - a.length),
      heavyNomineeCutoff,
    };
  } catch {
    return buildDemoRaw() as any;
  }
}
