"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { findArtwork } from "./artwork";
import { prisma } from "./prisma";
import { filmSlug, slugify } from "./slug";

async function upsertFilm(title: string, year: number) {
  const existing = await prisma.film.findUnique({ where: { title_year: { title, year } } });
  if (existing) return existing;
  const art = await findArtwork(title, year);
  return prisma.film.create({
    data: {
      title,
      year,
      slug: filmSlug(title, year),
      posterPath: art.posterPath,
      tmdbId: art.tmdbId,
      imdbId: art.imdbId,
    },
  });
}

export type LogState = { error?: string };

export async function addPendingPersonNamed(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  if (!process.env.DATABASE_URL) return { id: `pending-${slugify(trimmed)}`, name: trimmed, slug: slugify(trimmed), verified: false };
  try {
    return await prisma.person.upsert({
      where: { slug: slugify(trimmed) },
      update: {},
      create: { name: trimmed, slug: slugify(trimmed), verified: false },
    });
  } catch {
    return { id: `pending-${slugify(trimmed)}`, name: trimmed, slug: slugify(trimmed), verified: false };
  }
}

export async function createSystemNight(_: LogState, formData: FormData): Promise<LogState> {
  if (!process.env.DATABASE_URL) {
    return {
      error: "The Log is not attached. In Vercel: Storage → Create Database → Neon. Then tell me done.",
    };
  }
  try {
    const dateRaw = String(formData.get("date") || "");
    const notes = String(formData.get("notes") || "").trim() || null;
    const unanimous = formData.get("unanimous") === "on";
    const attendeeIds = formData.getAll("attendees").map(String).filter(Boolean);
    const goldenChildId = String(formData.get("goldenChildId") || "") || null;
    if (!dateRaw) return { error: "Date is required." };
    if (attendeeIds.length < 2) return { error: "The room must have at least two members." };
    if (!unanimous && (!goldenChildId || !attendeeIds.includes(goldenChildId))) {
      return { error: "The Golden Child must be a member present." };
    }
    const pickMap = new Map<string, Map<string, number>>();
    for (const personId of attendeeIds) {
      pickMap.set(personId, new Map());
      const max = formData.get(`birthday-${personId}`) ? 3 : 2;
      let used = 0;
      for (let slot = 1; slot <= 3; slot++) {
        const title = String(formData.get(`pick-title-${personId}-${slot}`) || "").trim();
        const yearRaw = String(formData.get(`pick-year-${personId}-${slot}`) || "").trim();
        const weight = Number(formData.get(`pick-weight-${personId}-${slot}`) || 0);
        if (!title && !yearRaw && !weight) continue;
        if (!title || !yearRaw || weight < 1) return { error: `Complete pick ${slot}, or leave it blank.` };
        used += weight;
        if (used > max) return { error: "Pick allotment exceeded." };
        const film = await upsertFilm(title, Number(yearRaw));
        const bag = pickMap.get(personId)!;
        bag.set(film.id, (bag.get(film.id) ?? 0) + weight);
      }
      if (!unanimous && used < 1) {
        return { error: "Each member present records at least one pick, unless the night is Unanimous." };
      }
    }
    const watchedTitle = String(formData.get("watchedTitle") || "").trim();
    const watchedYear = Number(formData.get("watchedYear") || 0);
    if (!watchedTitle || !watchedYear) return { error: "Record the film that screened." };
    const watched = await upsertFilm(watchedTitle, watchedYear);
    let finalistIds = [watched.id];
    if (!unanimous) {
      const finalistA = String(formData.get("finalistA") || "").trim();
      const yearA = Number(formData.get("finalistAYear") || 0);
      const finalistB = String(formData.get("finalistB") || "").trim();
      const yearB = Number(formData.get("finalistBYear") || 0);
      if (!finalistA || !yearA || !finalistB || !yearB) {
        return { error: "The System requires the final two, unless Unanimous is called." };
      }
      const filmA = await upsertFilm(finalistA, yearA);
      const filmB = await upsertFilm(finalistB, yearB);
      if (watched.id !== filmA.id && watched.id !== filmB.id) {
        return { error: "The film that screened must be one of the final two." };
      }
      finalistIds = [filmA.id, filmB.id];
    }
    const night = await prisma.systemNight.create({
      data: {
        date: new Date(`${dateRaw}T19:00:00`),
        notes,
        unanimous,
        goldenChildId,
        watchedFilmId: watched.id,
        attendees: { create: attendeeIds.map((personId) => ({ personId })) },
        finalists: { create: [...new Set(finalistIds)].map((filmId) => ({ filmId })) },
        picks: {
          create: [...pickMap.entries()].flatMap(([personId, bag]) =>
            [...bag.entries()].map(([filmId, weight]) => ({ personId, filmId, weight })),
          ),
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/archive");
    revalidatePath("/log");
    redirect(`/nights/${night.id}`);
  } catch {
    return { error: "The Log could not write. Neon is missing or the schema is not pushed." };
  }
}
