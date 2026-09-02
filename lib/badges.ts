import type { Crusade, FilmLedgerStats, PersonLedgerStats } from "./types";

export type BadgeView = {
  slug: string;
  name: string;
  description: string;
};

export function personAutoBadges(
  person: { isFounding: boolean; verified: boolean },
  stats: PersonLedgerStats,
): BadgeView[] {
  const badges: BadgeView[] = [];
  if (person.isFounding) {
    badges.push({ slug: "founding-member", name: "Founding Member", description: "There from the college years." });
  }
  if (stats.goldenChild >= 10) {
    badges.push({ slug: "golden-child-10", name: "Golden Child \u00d710", description: "Chose the film ten times." });
  } else if (stats.goldenChild >= 5) {
    badges.push({ slug: "golden-child-5", name: "Golden Child \u00d75", description: "Chose the film five times." });
  } else if (stats.goldenChild >= 1) {
    badges.push({ slug: "golden-child", name: "Golden Child", description: "Has held the Golden Child." });
  }
  if (stats.currentCrusade && stats.currentCrusade.length >= 3) {
    badges.push({
      slug: "on-crusade",
      name: "On Crusade",
      description: `Currently carrying ${stats.currentCrusade.filmTitle}.`,
    });
  }
  if (stats.longestCrusade && stats.longestCrusade.length >= 8) {
    badges.push({
      slug: "crusader",
      name: "Crusader",
      description: `Went ${stats.longestCrusade.length} nights on ${stats.longestCrusade.filmTitle}.`,
    });
  }
  if (stats.nights >= 40) {
    badges.push({ slug: "regular", name: "Regular", description: "Has sat through forty Systems or more." });
  }
  if (!person.verified) {
    badges.push({ slug: "pending", name: "Pending", description: "Name not yet verified against the books." });
  }
  return badges;
}

export function filmAutoBadges(
  film: { year: number; country: string | null },
  stats: FilmLedgerStats,
  heavyNomineeCutoff: number,
): BadgeView[] {
  const badges: BadgeView[] = [];
  if (stats.watchedCount >= 1) badges.push({ slug: "screened", name: "Screened", description: "Chosen as the film of the night." });
  if (stats.watchedCount >= 2) badges.push({ slug: "encore", name: "Encore", description: "Watched more than once." });
  if (stats.finalistCount >= 1) badges.push({ slug: "finalist", name: "Finalist", description: "Made the last two." });
  if (stats.finalistCount >= 3 && stats.watchedCount === 0) {
    badges.push({ slug: "bridesmaid", name: "Bridesmaid", description: "Finalist at least three times. Still unwatched." });
  }
  if (stats.pickCount >= heavyNomineeCutoff && heavyNomineeCutoff > 0) {
    badges.push({ slug: "heavy-nominee", name: "Heavy Nominee", description: "Among the most-picked titles in the ledger." });
  }
  if (stats.crusadeCount > 0) {
    badges.push({ slug: "crusade-object", name: "Crusade Object", description: "Someone ran a crusade at this title." });
  }
  if (stats.activeCrusade) {
    badges.push({ slug: "active-crusade", name: "Active Crusade", description: "A crusade on this title is still open." });
  }
  if (film.country === "HK") badges.push({ slug: "hong-kong", name: "Hong Kong", description: "Hong Kong picture." });
  if (film.year >= 1980 && film.year <= 1989) badges.push({ slug: "1980s", name: "1980s", description: "Released in the 1980s." });
  if (film.year >= 1990 && film.year <= 1999) badges.push({ slug: "1990s", name: "1990s", description: "Released in the 1990s." });
  return badges;
}

export function longestCrusade(crusades: Crusade[], personId: string) {
  return crusades.filter((c) => c.personId === personId).sort((a, b) => b.length - a.length)[0] ?? null;
}

export function currentCrusade(crusades: Crusade[], personId: string) {
  return crusades.filter((c) => c.personId === personId && c.active).sort((a, b) => b.length - a.length)[0] ?? null;
}
