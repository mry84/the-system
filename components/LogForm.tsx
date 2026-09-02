"use client";

import { useActionState, useMemo, useState } from "react";
import { createSystemNight, type LogState } from "@/lib/actions";

type Person = { id: string; name: string; verified?: boolean };
type PickRow = { title: string; year: string; weight: number };

const field = "w-full rounded-xl border border-line bg-bg2 px-4";

function slugifyName(name: string) {
  return name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function LogForm({ people }: { people: Person[] }) {
  const [state, action] = useActionState(createSystemNight, {} as LogState);
  const [roster, setRoster] = useState(people);
  const [selected, setSelected] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [unanimous, setUnanimous] = useState(false);
  const [goldenChildId, setGoldenChildId] = useState("");
  const [birthdays, setBirthdays] = useState<string[]>([]);
  const [picks, setPicks] = useState<Record<string, PickRow[]>>({});
  const [draft, setDraft] = useState<Record<string, { title: string; year: string }>>({});
  const [finalA, setFinalA] = useState("");
  const [finalB, setFinalB] = useState("");
  const [watched, setWatched] = useState("");

  const present = useMemo(() => roster.filter((p) => selected.includes(p.id)), [roster, selected]);
  const nominated = useMemo(() => {
    const map = new Map<string, { title: string; year: string }>();
    for (const rows of Object.values(picks)) {
      for (const row of rows) {
        const key = `${row.title.trim().toLowerCase()}|${row.year}`;
        if (row.title.trim() && row.year) map.set(key, { title: row.title.trim(), year: row.year });
      }
    }
    return [...map.values()];
  }, [picks]);

  function addMember() {
    const name = newName.trim();
    if (!name) return;
    const id = `pending-${slugifyName(name)}`;
    setRoster((cur) =>
      cur.some((p) => p.id === id || p.name.toLowerCase() === name.toLowerCase()) ? cur : [...cur, { id, name, verified: false }],
    );
    setSelected((cur) => (cur.includes(id) ? cur : [...cur, id]));
    setNewName("");
  }

  function togglePerson(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  function allotment(id: string) {
    return birthdays.includes(id) ? 3 : 2;
  }

  function usedWeight(id: string) {
    return (picks[id] ?? []).reduce((sum, row) => sum + row.weight, 0);
  }

  function addPick(id: string) {
    const title = (draft[id]?.title ?? "").trim();
    const year = (draft[id]?.year ?? "").trim();
    if (!title || !year) return;
    const remaining = allotment(id) - usedWeight(id);
    if (remaining < 1) return;
    setPicks((cur) => {
      const rows = [...(cur[id] ?? [])];
      const existing = rows.find((row) => row.title.toLowerCase() === title.toLowerCase() && row.year === year);
      if (existing) existing.weight = Math.min(existing.weight + 1, existing.weight + remaining);
      else rows.push({ title, year, weight: 1 });
      return { ...cur, [id]: rows };
    });
    setDraft((cur) => ({ ...cur, [id]: { title: "", year: "" } }));
  }

  function bumpPick(id: string, index: number) {
    setPicks((cur) => {
      const rows = [...(cur[id] ?? [])];
      const remaining = allotment(id) - rows.reduce((sum, row) => sum + row.weight, 0);
      if (remaining < 1) return cur;
      rows[index] = { ...rows[index], weight: rows[index].weight + 1 };
      return { ...cur, [id]: rows };
    });
  }

  function dropPick(id: string, index: number) {
    setPicks((cur) => ({ ...cur, [id]: (cur[id] ?? []).filter((_, i) => i !== index) }));
  }

  function filmKey(film: { title: string; year: string }) {
    return `${film.title}|${film.year}`;
  }

  return (
    <form action={action} className="space-y-10">
      {selected.map((id) => (
        <input key={id} type="hidden" name="attendees" value={id} />
      ))}
      {birthdays.map((id) => (
        <input key={`b-${id}`} type="hidden" name={`birthday-${id}`} value="on" />
      ))}
      {present.map((person) =>
        (picks[person.id] ?? []).flatMap((row, index) => {
          const slots: number[] = [];
          for (let i = 0; i < row.weight; i++) slots.push(index * 3 + i + 1);
          return slots.slice(0, 3).map((slot) => (
            <span key={`${person.id}-${slot}-${row.title}`}>
              <input type="hidden" name={`pick-title-${person.id}-${slot}`} value={row.title} />
              <input type="hidden" name={`pick-year-${person.id}-${slot}`} value={row.year} />
              <input type="hidden" name={`pick-weight-${person.id}-${slot}`} value="1" />
            </span>
          ));
        }),
      )}
      {unanimous ? <input type="hidden" name="unanimous" value="on" /> : null}
      {!unanimous && goldenChildId ? <input type="hidden" name="goldenChildId" value={goldenChildId} /> : null}
      {finalA ? (
        <>
          <input type="hidden" name="finalistA" value={finalA.split("|")[0]} />
          <input type="hidden" name="finalistAYear" value={finalA.split("|")[1] ?? ""} />
        </>
      ) : null}
      {finalB ? (
        <>
          <input type="hidden" name="finalistB" value={finalB.split("|")[0]} />
          <input type="hidden" name="finalistBYear" value={finalB.split("|")[1] ?? ""} />
        </>
      ) : null}
      {watched ? (
        <>
          <input type="hidden" name="watchedTitle" value={watched.split("|")[0]} />
          <input type="hidden" name="watchedYear" value={watched.split("|")[1] ?? ""} />
        </>
      ) : null}

      {state.error ? <p className="rounded-xl bg-cta/15 px-4 py-3 text-sm text-cta">{state.error}</p> : null}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">When</h3>
        <label className="block text-sm font-medium">
          Date
          <input type="date" name="date" required className={`mt-2 ${field}`} />
        </label>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">Who</h3>
        <div className="flex flex-wrap gap-2">
          {roster.map((person) => {
            const on = selected.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                onClick={() => togglePerson(person.id)}
                className={`min-h-12 rounded-full px-4 text-sm ${
                  on ? "bg-paper text-bg" : "bg-bg2 text-muted"
                }`}
              >
                {person.name}
              </button>
            );
          })}
        </div>
        <div className="flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Not on the list"
            className={`min-h-12 flex-1 ${field}`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addMember();
              }
            }}
          />
          <button type="button" onClick={addMember} className="min-h-12 rounded-xl bg-cta px-5 text-sm font-medium text-white">
            Add
          </button>
        </div>
        <button
          type="button"
          onClick={() => setUnanimous((v) => !v)}
          className={`flex min-h-14 w-full items-center justify-between rounded-2xl px-4 text-left ${
            unanimous ? "bg-paper text-bg" : "bg-bg3"
          }`}
        >
          <span>
            <span className="block font-medium">Unanimous</span>
            <span className={`block text-sm ${unanimous ? "text-bg/70" : "text-muted"}`}>The room agreed.</span>
          </span>
          <span className="text-sm">{unanimous ? "Called" : "Not called"}</span>
        </button>
        {!unanimous && present.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {present.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setGoldenChildId(person.id)}
                className={`min-h-12 rounded-full px-4 text-sm ${
                  goldenChildId === person.id ? "bg-cta text-white" : "bg-bg3 text-muted"
                }`}
              >
                {person.name}
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <section className="space-y-4">
        {!unanimous && present.length ? <h3 className="text-lg font-semibold">What</h3> : null}
        {!unanimous
          ? present.map((person) => {
              const left = allotment(person.id) - usedWeight(person.id);
              return (
                <section key={person.id} className="space-y-3 rounded-2xl bg-bg2 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-base font-semibold">{person.name}</p>
                    <button
                      type="button"
                      onClick={() =>
                        setBirthdays((cur) => (cur.includes(person.id) ? cur.filter((x) => x !== person.id) : [...cur, person.id]))
                      }
                      className={`min-h-10 rounded-full px-3 text-xs ${
                        birthdays.includes(person.id) ? "bg-cta text-white" : "bg-bg3 text-muted"
                      }`}
                    >
                      Birthday
                    </button>
                  </div>
                  <p className="text-sm text-muted">{left} pick{left === 1 ? "" : "s"} remaining</p>
                  <div className="flex flex-wrap gap-2">
                    {(picks[person.id] ?? []).map((row, index) => (
                      <span key={`${row.title}-${row.year}`} className="flex min-h-10 items-center gap-2 rounded-full bg-bg3 px-3 text-sm">
                        <button type="button" onClick={() => bumpPick(person.id, index)}>
                          {row.title} ({row.year}) ×{row.weight}
                        </button>
                        <button type="button" onClick={() => dropPick(person.id, index)} className="text-muted">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  {left > 0 ? (
                    <div className="grid gap-2 sm:grid-cols-[1fr_6rem_auto]">
                      <input
                        value={draft[person.id]?.title ?? ""}
                        onChange={(e) => setDraft((cur) => ({ ...cur, [person.id]: { title: e.target.value, year: cur[person.id]?.year ?? "" } }))}
                        placeholder="Film"
                        className={field}
                      />
                      <input
                        value={draft[person.id]?.year ?? ""}
                        onChange={(e) => setDraft((cur) => ({ ...cur, [person.id]: { title: cur[person.id]?.title ?? "", year: e.target.value } }))}
                        placeholder="Year"
                        inputMode="numeric"
                        className={field}
                      />
                      <button type="button" onClick={() => addPick(person.id)} className="min-h-12 rounded-xl bg-paper px-4 text-sm font-medium text-bg">
                        Add pick
                      </button>
                    </div>
                  ) : null}
                </section>
              );
            })
          : null}
      </section>

      {!unanimous ? (
        <section className="space-y-3">
          <h3 className="text-lg font-semibold">What</h3>
          {nominated.length === 0 ? (
            <p className="text-sm text-muted">Picks appear here once they are on the table.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">Finalist A</p>
                <div className="flex flex-wrap gap-2">
                  {nominated.map((film) => (
                    <button
                      key={`a-${filmKey(film)}`}
                      type="button"
                      onClick={() => setFinalA(filmKey(film))}
                      className={`min-h-12 rounded-full px-4 text-sm ${
                        finalA === filmKey(film) ? "bg-paper text-bg" : "bg-bg2 text-muted"
                      }`}
                    >
                      {film.title}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.14em] text-muted">Finalist B</p>
                <div className="flex flex-wrap gap-2">
                  {nominated.map((film) => (
                    <button
                      key={`b-${filmKey(film)}`}
                      type="button"
                      onClick={() => setFinalB(filmKey(film))}
                      className={`min-h-12 rounded-full px-4 text-sm ${
                        finalB === filmKey(film) ? "bg-paper text-bg" : "bg-bg2 text-muted"
                      }`}
                    >
                      {film.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      ) : null}

      <section className="space-y-3">
        <h3 className="text-lg font-semibold">What</h3>
        {unanimous ? (
          <div className="grid gap-2 sm:grid-cols-[1fr_6rem]">
            <input name="watchedTitle" required placeholder="Title" className={field} />
            <input name="watchedYear" required placeholder="Year" inputMode="numeric" className={field} />
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {[finalA, finalB]
              .filter(Boolean)
              .map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setWatched(key)}
                  className={`min-h-12 rounded-full px-4 text-sm ${
                    watched === key ? "bg-cta text-white" : "bg-bg2 text-muted"
                  }`}
                >
                  {key.split("|")[0]}
                </button>
              ))}
            {!(finalA && finalB) ? <p className="text-sm text-muted">Name the last two first.</p> : null}
          </div>
        )}
      </section>

      <label className="block text-sm font-medium">
        Remarks
        <textarea name="notes" rows={4} placeholder="Lobbying, late start, the usual." className={`mt-2 ${field}`} />
      </label>

      <button className="w-full rounded-xl bg-cta text-base font-semibold text-white">Enter in The Log</button>
    </form>
  );
}
