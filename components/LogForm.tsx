"use client";

import { useActionState, useMemo, useState } from "react";
import { createSystemNight, type LogState } from "@/lib/actions";

type Person = { id: string; name: string; verified?: boolean };
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
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [newName, setNewName] = useState("");
  const [unanimous, setUnanimous] = useState(false);
  const present = useMemo(() => roster.filter((p) => selected.includes(p.id)), [roster, selected]);

  function addMember() {
    const name = newName.trim();
    if (!name) return;
    const id = `pending-${slugifyName(name)}`;
    const person = { id, name, verified: false };
    setRoster((cur) => (cur.some((p) => p.id === person.id || p.name.toLowerCase() === name.toLowerCase()) ? cur : [...cur, person]));
    setSelected((cur) => (cur.includes(id) ? cur : [...cur, id]));
    setNewName("");
    setOpen(true);
  }

  function toggle(id: string) {
    setSelected((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));
  }

  return (
    <form action={action} className="space-y-8">
      {selected.map((id) => (
        <input key={id} type="hidden" name="attendees" value={id} />
      ))}
      <input type="hidden" name="newMemberName" value={newName} />
      {state.error ? <p className="rounded-xl bg-cta/15 px-4 py-3 text-sm text-cta">{state.error}</p> : null}

      <label className="block text-sm font-medium">
        Date
        <input type="date" name="date" required className={`mt-2 ${field}`} />
      </label>

      <div>
        <p className="text-sm font-medium">Members present</p>
        <p className="mt-1 text-sm text-muted">Tap names. Do not take the whole roster unless they were all there.</p>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className={`mt-2 flex min-h-12 w-full items-center rounded-xl border border-line bg-bg2 px-4 text-left text-base ${
            present.length ? "text-paper" : "text-muted"
          }`}
        >
          {present.length ? `${present.length} present` : "Select members"}
        </button>
        {present.length ? (
          <p className="mt-2 text-sm leading-6 text-muted">{present.map((p) => p.name).join(", ")}</p>
        ) : null}
        {open ? (
          <div className="mt-2 overflow-hidden rounded-xl border border-line bg-bg2">
            {roster.map((person) => {
              const on = selected.includes(person.id);
              return (
                <button
                  key={person.id}
                  type="button"
                  onClick={() => toggle(person.id)}
                  className="flex min-h-14 w-full items-center justify-between gap-3 border-b border-line px-4 text-left last:border-b-0"
                >
                  <span>
                    {person.name}
                    {person.verified === false ? <span className="ml-2 text-xs text-muted">pending</span> : null}
                  </span>
                  <span className={`text-sm ${on ? "text-cta" : "text-muted"}`}>{on ? "In the room" : "Add"}</span>
                </button>
              );
            })}
          </div>
        ) : null}
        <div className="mt-3 flex gap-2">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Name not on the list"
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
      </div>

      <label className="flex min-h-14 items-center gap-3 rounded-xl bg-bg2 px-4 text-base">
        <input type="checkbox" name="unanimous" checked={unanimous} onChange={(e) => setUnanimous(e.target.checked)} />
        Unanimous — the room agreed. The System is suspended.
      </label>

      {!unanimous && present.length > 0 ? (
        <label className="block text-sm font-medium">
          The Golden Child
          <select name="goldenChildId" required className={`mt-2 ${field}`}>
            <option value="">Select</option>
            {present.map((person) => (
              <option key={person.id} value={person.id}>
                {person.name}
              </option>
            ))}
          </select>
        </label>
      ) : null}

      {!unanimous
        ? present.map((person) => (
            <fieldset key={person.id} className="rounded-2xl bg-bg2 p-4">
              <legend className="px-1 text-sm font-medium">{person.name}</legend>
              <label className="mb-3 flex min-h-12 items-center gap-3 text-sm">
                <input type="checkbox" name={`birthday-${person.id}`} />
                Birthday allotment (3 picks)
              </label>
              {[1, 2].map((slot) => (
                <div key={slot} className="mb-3 grid gap-2 sm:grid-cols-[1fr_6rem_6rem]">
                  <input name={`pick-title-${person.id}-${slot}`} placeholder={`Title ${slot}`} className={field} />
                  <input name={`pick-year-${person.id}-${slot}`} placeholder="Year" inputMode="numeric" className={field} />
                  <input name={`pick-weight-${person.id}-${slot}`} placeholder="Picks" inputMode="numeric" className={field} />
                </div>
              ))}
              <div className="grid gap-2 sm:grid-cols-[1fr_6rem_6rem]">
                <input name={`pick-title-${person.id}-3`} placeholder="Title 3 (birthday only)" className={field} />
                <input name={`pick-year-${person.id}-3`} placeholder="Year" inputMode="numeric" className={field} />
                <input name={`pick-weight-${person.id}-3`} placeholder="Picks" inputMode="numeric" className={field} />
              </div>
            </fieldset>
          ))
        : null}

      {!unanimous ? (
        <div className="grid gap-3">
          <p className="text-sm font-medium">The final two</p>
          <div className="grid gap-2 sm:grid-cols-[1fr_6rem]">
            <input name="finalistA" placeholder="Film A" className={field} />
            <input name="finalistAYear" placeholder="Year" inputMode="numeric" className={field} />
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_6rem]">
            <input name="finalistB" placeholder="Film B" className={field} />
            <input name="finalistBYear" placeholder="Year" inputMode="numeric" className={field} />
          </div>
        </div>
      ) : null}

      <div className="grid gap-3">
        <p className="text-sm font-medium">Film screened</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_6rem]">
          <input name="watchedTitle" required className={field} placeholder="Title" />
          <input name="watchedYear" required placeholder="Year" inputMode="numeric" className={field} />
        </div>
      </div>

      <label className="block text-sm font-medium">
        Remarks
        <textarea name="notes" rows={4} placeholder="Lobbying, late start, the usual." className={`mt-2 ${field}`} />
      </label>

      <button className="w-full rounded-xl bg-cta text-base font-semibold text-white">Enter in The Log</button>
      <p className="text-sm text-muted">Entries do not persist until Neon is attached. Add still puts a name in this room.</p>
    </form>
  );
}
