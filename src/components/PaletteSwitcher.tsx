"use client";

import { useEffect, useRef, useState } from "react";

interface PaletteOption {
  id: string;
  name: string;
  note: string;
  colors: [string, string, string];
}

const PALETTES: PaletteOption[] = [
  {
    id: "arena",
    name: "Arena",
    note: "Terracota y mar profundo",
    colors: ["#EDE4CF", "#2E5A5E", "#C66B3D"],
  },
  {
    id: "coral",
    name: "Coral",
    note: "Coral, oliva y hueso",
    colors: ["#F1E7D7", "#5C6B3A", "#D95F38"],
  },
  {
    id: "salvia",
    name: "Salvia",
    note: "Ocre, salvia y arena tostada",
    colors: ["#E5D6BE", "#4F5F45", "#C08E3A"],
  },
  {
    id: "marea",
    name: "Marea",
    note: "Azul petróleo y naranja quemado",
    colors: ["#E8E2D4", "#1F5F6B", "#D2693C"],
  },
  {
    id: "atardecer",
    name: "Atardecer",
    note: "Durazno, arcilla y azul de sombra",
    colors: ["#F0DFCF", "#3D5A6B", "#C96A4A"],
  },
];

const STORAGE_KEY = "laserena-palette";

function applyPalette(id: string) {
  const wrapper = document.querySelector<HTMLElement>(".public-theme");
  if (wrapper) {
    wrapper.dataset.palette = id;
  }
}

export function PaletteSwitcher() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState("arena");
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = document.querySelector<HTMLElement>(".public-theme");
    const fromQuery = new URLSearchParams(window.location.search).get(
      "paleta",
    );
    const stored = window.localStorage.getItem(STORAGE_KEY);
    const validQuery =
      fromQuery && PALETTES.some((palette) => palette.id === fromQuery)
        ? fromQuery
        : null;
    const validStored =
      stored && PALETTES.some((palette) => palette.id === stored)
        ? stored
        : null;
    const initial =
      validQuery || validStored || wrapper?.dataset.palette || "arena";

    setCurrent(initial);
    applyPalette(initial);
    window.localStorage.setItem(STORAGE_KEY, initial);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  function choose(id: string) {
    setCurrent(id);
    applyPalette(id);
    window.localStorage.setItem(STORAGE_KEY, id);
  }

  return (
    <div className="palette-switcher" ref={rootRef}>
      {open && (
        <div
          id="palette-panel"
          className="palette-panel"
          role="group"
          aria-label="Paletas de color"
        >
          <div className="palette-head">
            <div>
              <p className="palette-title">Paletas</p>
              <p className="palette-subtitle">Elegí una para comparar.</p>
            </div>
            <button
              type="button"
              className="palette-close"
              onClick={() => setOpen(false)}
              aria-label="Cerrar paletas"
            >
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                aria-hidden="true"
              >
                <path
                  d="M3 3l10 10M13 3L3 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <ul className="palette-list">
            {PALETTES.map((palette) => (
              <li key={palette.id}>
                <button
                  type="button"
                  className={`palette-option${
                    current === palette.id ? " is-current" : ""
                  }`}
                  onClick={() => choose(palette.id)}
                  aria-pressed={current === palette.id}
                >
                  <span className="palette-swatches" aria-hidden="true">
                    {palette.colors.map((color) => (
                      <span key={color} style={{ background: color }} />
                    ))}
                  </span>
                  <span className="palette-copy">
                    <span className="palette-name">{palette.name}</span>
                    <span className="palette-note">{palette.note}</span>
                  </span>
                  {current === palette.id && (
                    <span className="palette-current">Actual</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className="palette-toggle"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls="palette-panel"
      >
        <span className="palette-toggle-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        Paletas
      </button>
    </div>
  );
}
