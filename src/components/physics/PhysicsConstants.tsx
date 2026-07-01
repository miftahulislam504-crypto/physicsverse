"use client";

// src/components/physics/PhysicsConstants.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";
import { FormulaRenderer } from "./FormulaRenderer";

interface Constant {
  symbol:      string;
  name:        string;
  value:       string;
  unit:        string;
  description: string;
  usedIn:      string[];
}

const CONSTANTS: Constant[] = [
  { symbol: "c",    name: "Speed of Light",          value: "2.998 × 10⁸",   unit: "m/s",       description: "Maximum speed in the universe. Fundamental to electromagnetism and relativity.", usedIn: ["Electromagnetism", "Relativity", "Optics"] },
  { symbol: "h",    name: "Planck's Constant",        value: "6.626 × 10⁻³⁴", unit: "J·s",       description: "Relates photon energy to frequency. The cornerstone of quantum mechanics.", usedIn: ["Quantum Mechanics", "Photoelectric Effect"] },
  { symbol: "ℏ",    name: "Reduced Planck Constant",  value: "1.055 × 10⁻³⁴", unit: "J·s",       description: "h/(2π). Appears in Heisenberg uncertainty and Schrödinger equation.", usedIn: ["Quantum Mechanics"] },
  { symbol: "G",    name: "Gravitational Constant",   value: "6.674 × 10⁻¹¹", unit: "N·m²/kg²",  description: "Determines the strength of gravitational attraction between masses.", usedIn: ["Gravitation", "Astrophysics"] },
  { symbol: "g",    name: "Standard Gravity",         value: "9.806 65",       unit: "m/s²",      description: "Standard acceleration due to gravity at Earth's surface.", usedIn: ["Mechanics", "Thermodynamics"] },
  { symbol: "kB",   name: "Boltzmann Constant",       value: "1.381 × 10⁻²³", unit: "J/K",       description: "Relates temperature to average kinetic energy of gas particles.", usedIn: ["Thermodynamics", "Statistical Mechanics"] },
  { symbol: "e",    name: "Elementary Charge",        value: "1.602 × 10⁻¹⁹", unit: "C",         description: "Charge of a proton (or magnitude of electron charge). Fundamental unit of electric charge.", usedIn: ["Electricity", "Modern Physics"] },
  { symbol: "me",   name: "Electron Mass",            value: "9.109 × 10⁻³¹", unit: "kg",        description: "Rest mass of an electron.", usedIn: ["Modern Physics", "Quantum Mechanics"] },
  { symbol: "mp",   name: "Proton Mass",              value: "1.673 × 10⁻²⁷", unit: "kg",        description: "Rest mass of a proton. About 1836 times heavier than an electron.", usedIn: ["Modern Physics", "Nuclear Physics"] },
  { symbol: "ε₀",   name: "Permittivity of Free Space",value:"8.854 × 10⁻¹²", unit: "F/m",       description: "Determines the strength of the electric force in vacuum.", usedIn: ["Electricity", "Electromagnetism"] },
  { symbol: "μ₀",   name: "Permeability of Free Space",value:"1.257 × 10⁻⁶",  unit: "H/m",       description: "Determines the strength of the magnetic force in vacuum.", usedIn: ["Magnetism", "Electromagnetism"] },
  { symbol: "R",    name: "Ideal Gas Constant",       value: "8.314",          unit: "J/(mol·K)", description: "Relates pressure, volume, temperature and amount of an ideal gas.", usedIn: ["Thermodynamics"] },
  { symbol: "NA",   name: "Avogadro's Number",        value: "6.022 × 10²³",  unit: "mol⁻¹",     description: "Number of particles in one mole of a substance.", usedIn: ["Thermodynamics", "Modern Physics"] },
  { symbol: "σ",    name: "Stefan-Boltzmann Constant",value: "5.671 × 10⁻⁸",  unit: "W/(m²·K⁴)", description: "Governs thermal radiation emitted by a black body.", usedIn: ["Thermodynamics", "Astrophysics"] },
];

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }
  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded-lg transition-all hover:bg-[var(--color-surface-2)]"
      title="Copy value"
    >
      {copied
        ? <Check size={13} style={{ color: "#22c55e" }} />
        : <Copy size={13} style={{ color: "var(--color-text-muted)" }} />
      }
    </button>
  );
}

export function PhysicsConstants() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string | "all">("all");

  const allTopics = Array.from(new Set(CONSTANTS.flatMap((c) => c.usedIn)));

  const filtered = CONSTANTS.filter((c) => {
    const q  = search.toLowerCase();
    const ok = !q || c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q);
    const ft = filter === "all" || c.usedIn.includes(filter);
    return ok && ft;
  });

  return (
    <div className="space-y-4">
      {/* Search + filter */}
      <div className="flex gap-3">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search constants..."
          className="flex-1 px-3 py-2 rounded-xl border text-sm outline-none"
          style={{
            background:  "var(--color-surface)",
            borderColor: "var(--color-border)",
            color:       "var(--color-text-primary)",
          }}
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border text-sm outline-none"
          style={{
            background:  "var(--color-surface)",
            borderColor: "var(--color-border)",
            color:       "var(--color-text-primary)",
          }}
        >
          <option value="all">All Topics</option>
          {allTopics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {/* Constants table */}
      <div className="space-y-2">
        {filtered.map((c, i) => (
          <motion.div
            key={c.symbol}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="p-4 rounded-2xl border"
            style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
          >
            <div className="flex items-start gap-3">
              {/* Symbol */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ background: "var(--color-primary-subtle)", color: "var(--color-primary)" }}
              >
                <FormulaRenderer latex={c.symbol} />
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {c.name}
                  </p>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className="text-sm font-mono"
                      style={{ color: "var(--color-primary)" }}
                    >
                      {c.value}
                    </span>
                    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                      {c.unit}
                    </span>
                    <CopyButton text={`${c.value} ${c.unit}`} />
                  </div>
                </div>
                <p className="text-xs mt-1 leading-relaxed"
                  style={{ color: "var(--color-text-muted)" }}>
                  {c.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.usedIn.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{ background: "var(--color-surface-2)", color: "var(--color-text-muted)" }}
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
