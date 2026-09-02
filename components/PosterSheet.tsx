"use client";

import { useState } from "react";
import { Poster } from "@/components/Poster";
import { filmLinks, type FilmRef } from "@/lib/film-links";

export function PosterSheet({
  film,
  posterPath,
  className = "",
}: {
  film: FilmRef;
  posterPath?: string | null;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const links = filmLinks(film);

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={`block w-full text-left ${className}`}>
        <Poster title={film.title} year={film.year} posterPath={posterPath} />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
          <button type="button" className="absolute inset-0 bg-black/70" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="relative w-full max-w-md rounded-t-2xl bg-bg2 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:rounded-2xl">
            <p className="px-2 text-sm text-muted">
              {film.title} ({film.year})
            </p>
            <div className="mt-3 grid gap-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="flex min-h-12 items-center rounded-xl bg-bg3 px-4 text-base"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <button type="button" onClick={() => setOpen(false)} className="flex min-h-12 items-center justify-center rounded-xl text-muted">
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
