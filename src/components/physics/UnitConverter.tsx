"use client";

// src/components/physics/UnitConverter.tsx
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";

interface UnitGroup {
  label:  string;
  icon:   string;
  units:  { name: string; symbol: string; toSI: (v: number) => number; fromSI: (v: number) => number }[];
}

const UNIT_GROUPS: UnitGroup[] = [
  {
    label: "Length",
    icon:  "📏",
    units: [
      { name: "Metre",      symbol: "m",   toSI: (v) => v,        fromSI: (v) => v        },
      { name: "Centimetre", symbol: "cm",  toSI: (v) => v / 100,  fromSI: (v) => v * 100  },
      { name: "Millimetre", symbol: "mm",  toSI: (v) => v / 1000, fromSI: (v) => v * 1000 },
      { name: "Kilometre",  symbol: "km",  toSI: (v) => v * 1000, fromSI: (v) => v / 1000 },
      { name: "Mile",       symbol: "mi",  toSI: (v) => v * 1609.34, fromSI: (v) => v / 1609.34 },
      { name: "Inch",       symbol: "in",  toSI: (v) => v * 0.0254, fromSI: (v) => v / 0.0254 },
      { name: "Foot",       symbol: "ft",  toSI: (v) => v * 0.3048, fromSI: (v) => v / 0.3048 },
      { name: "Nanometre",  symbol: "nm",  toSI: (v) => v * 1e-9, fromSI: (v) => v / 1e-9 },
    ],
  },
  {
    label: "Mass",
    icon:  "⚖️",
    units: [
      { name: "Kilogram",   symbol: "kg",  toSI: (v) => v,         fromSI: (v) => v         },
      { name: "Gram",       symbol: "g",   toSI: (v) => v / 1000,  fromSI: (v) => v * 1000  },
      { name: "Milligram",  symbol: "mg",  toSI: (v) => v / 1e6,   fromSI: (v) => v * 1e6   },
      { name: "Tonne",      symbol: "t",   toSI: (v) => v * 1000,  fromSI: (v) => v / 1000  },
      { name: "Pound",      symbol: "lb",  toSI: (v) => v * 0.4536,fromSI: (v) => v / 0.4536},
      { name: "Ounce",      symbol: "oz",  toSI: (v) => v * 0.02835,fromSI:(v) => v / 0.02835},
    ],
  },
  {
    label: "Time",
    icon:  "⏱️",
    units: [
      { name: "Second",     symbol: "s",   toSI: (v) => v,         fromSI: (v) => v         },
      { name: "Millisecond",symbol: "ms",  toSI: (v) => v / 1000,  fromSI: (v) => v * 1000  },
      { name: "Microsecond",symbol: "μs",  toSI: (v) => v / 1e6,   fromSI: (v) => v * 1e6   },
      { name: "Minute",     symbol: "min", toSI: (v) => v * 60,    fromSI: (v) => v / 60    },
      { name: "Hour",       symbol: "h",   toSI: (v) => v * 3600,  fromSI: (v) => v / 3600  },
      { name: "Day",        symbol: "d",   toSI: (v) => v * 86400, fromSI: (v) => v / 86400 },
      { name: "Year",       symbol: "yr",  toSI: (v) => v * 3.156e7,fromSI:(v) => v / 3.156e7},
    ],
  },
  {
    label: "Speed",
    icon:  "💨",
    units: [
      { name: "m/s",        symbol: "m/s",   toSI: (v) => v,          fromSI: (v) => v          },
      { name: "km/h",       symbol: "km/h",  toSI: (v) => v / 3.6,    fromSI: (v) => v * 3.6    },
      { name: "mph",        symbol: "mph",   toSI: (v) => v * 0.44704,fromSI: (v) => v / 0.44704},
      { name: "knot",       symbol: "kn",    toSI: (v) => v * 0.5144, fromSI: (v) => v / 0.5144 },
      { name: "Speed of light",symbol:"c",   toSI: (v) => v * 3e8,    fromSI: (v) => v / 3e8    },
    ],
  },
  {
    label: "Energy",
    icon:  "⚡",
    units: [
      { name: "Joule",      symbol: "J",    toSI: (v) => v,          fromSI: (v) => v          },
      { name: "Kilojoule",  symbol: "kJ",   toSI: (v) => v * 1000,   fromSI: (v) => v / 1000   },
      { name: "Calorie",    symbol: "cal",  toSI: (v) => v * 4.184,  fromSI: (v) => v / 4.184  },
      { name: "Kilocalorie",symbol: "kcal", toSI: (v) => v * 4184,   fromSI: (v) => v / 4184   },
      { name: "Watt-hour",  symbol: "Wh",   toSI: (v) => v * 3600,   fromSI: (v) => v / 3600   },
      { name: "kWh",        symbol: "kWh",  toSI: (v) => v * 3.6e6,  fromSI: (v) => v / 3.6e6  },
      { name: "Electronvolt",symbol:"eV",   toSI: (v) => v * 1.602e-19,fromSI:(v)=>v / 1.602e-19},
    ],
  },
  {
    label: "Temperature",
    icon:  "🌡️",
    units: [
      { name: "Celsius",    symbol: "°C",  toSI: (v) => v + 273.15,  fromSI: (v) => v - 273.15 },
      { name: "Fahrenheit", symbol: "°F",  toSI: (v) => (v - 32) * 5/9 + 273.15, fromSI: (v) => (v - 273.15) * 9/5 + 32 },
      { name: "Kelvin",     symbol: "K",   toSI: (v) => v,            fromSI: (v) => v           },
    ],
  },
  {
    label: "Force",
    icon:  "💪",
    units: [
      { name: "Newton",     symbol: "N",   toSI: (v) => v,           fromSI: (v) => v           },
      { name: "Kilonewton", symbol: "kN",  toSI: (v) => v * 1000,    fromSI: (v) => v / 1000    },
      { name: "Dyne",       symbol: "dyn", toSI: (v) => v * 1e-5,    fromSI: (v) => v / 1e-5    },
      { name: "Pound-force",symbol: "lbf", toSI: (v) => v * 4.448,   fromSI: (v) => v / 4.448   },
    ],
  },
  {
    label: "Pressure",
    icon:  "🔵",
    units: [
      { name: "Pascal",     symbol: "Pa",  toSI: (v) => v,           fromSI: (v) => v           },
      { name: "Kilopascal", symbol: "kPa", toSI: (v) => v * 1000,    fromSI: (v) => v / 1000    },
      { name: "Megapascal", symbol: "MPa", toSI: (v) => v * 1e6,     fromSI: (v) => v / 1e6     },
      { name: "Atmosphere", symbol: "atm", toSI: (v) => v * 101325,  fromSI: (v) => v / 101325  },
      { name: "Bar",        symbol: "bar", toSI: (v) => v * 1e5,     fromSI: (v) => v / 1e5     },
      { name: "mmHg",       symbol: "mmHg",toSI: (v) => v * 133.322, fromSI: (v) => v / 133.322 },
    ],
  },
];

function fmt(n: number): string {
  if (!isFinite(n)) return "—";
  const abs = Math.abs(n);
  if (abs === 0) return "0";
  if (abs >= 1e10 || (abs < 1e-4 && abs > 0)) return n.toExponential(4);
  return +n.toPrecision(6) + "";
}

export function UnitConverter() {
  const [groupIdx, setGroupIdx] = useState(0);
  const [fromIdx,  setFromIdx]  = useState(0);
  const [toIdx,    setToIdx]    = useState(1);
  const [input,    setInput]    = useState("1");

  const group = UNIT_GROUPS[groupIdx];
  const from  = group.units[fromIdx];
  const to    = group.units[toIdx];

  const result = useMemo(() => {
    const n = parseFloat(input);
    if (isNaN(n)) return "";
    const si = from.toSI(n);
    return fmt(to.fromSI(si));
  }, [input, from, to]);

  function swap() {
    setFromIdx(toIdx);
    setToIdx(fromIdx);
  }

  return (
    <div
      className="rounded-2xl border p-5 space-y-5"
      style={{ background: "var(--color-surface)", borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">🔄</span>
        <h3 className="text-base font-display font-semibold"
          style={{ color: "var(--color-text-primary)" }}>
          Unit Converter
        </h3>
      </div>

      {/* Quantity selector */}
      <div className="flex flex-wrap gap-2">
        {UNIT_GROUPS.map((g, i) => (
          <button
            key={g.label}
            onClick={() => { setGroupIdx(i); setFromIdx(0); setToIdx(1); }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all"
            style={{
              background:  groupIdx === i ? "var(--color-primary)" : "var(--color-surface-2)",
              color:       groupIdx === i ? "#fff" : "var(--color-text-secondary)",
            }}
          >
            {g.icon} {g.label}
          </button>
        ))}
      </div>

      {/* Converter UI */}
      <div className="flex items-center gap-3">
        {/* From */}
        <div className="flex-1 space-y-1.5">
          <select
            value={fromIdx}
            onChange={(e) => setFromIdx(+e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{
              background:  "var(--color-surface-2)",
              borderColor: "var(--color-border)",
              color:       "var(--color-text-primary)",
            }}
          >
            {group.units.map((u, i) => (
              <option key={u.symbol} value={i}>{u.name} ({u.symbol})</option>
            ))}
          </select>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="number"
            className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono outline-none"
            style={{
              background:  "var(--color-surface-2)",
              borderColor: "var(--color-primary)",
              color:       "var(--color-primary)",
            }}
          />
        </div>

        {/* Swap button */}
        <button
          onClick={swap}
          className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center border transition-all hover:scale-110"
          style={{
            background:  "var(--color-surface-2)",
            borderColor: "var(--color-border)",
          }}
        >
          <ArrowLeftRight size={15} style={{ color: "var(--color-primary)" }} />
        </button>

        {/* To */}
        <div className="flex-1 space-y-1.5">
          <select
            value={toIdx}
            onChange={(e) => setToIdx(+e.target.value)}
            className="w-full px-3 py-2 rounded-xl border text-sm outline-none"
            style={{
              background:  "var(--color-surface-2)",
              borderColor: "var(--color-border)",
              color:       "var(--color-text-primary)",
            }}
          >
            {group.units.map((u, i) => (
              <option key={u.symbol} value={i}>{u.name} ({u.symbol})</option>
            ))}
          </select>
          <motion.div
            key={result}
            initial={{ opacity: 0.6 }}
            animate={{ opacity: 1 }}
            className="w-full px-3 py-2.5 rounded-xl border text-sm font-mono"
            style={{
              background:  "rgba(34,197,94,0.08)",
              borderColor: "rgba(34,197,94,0.3)",
              color:       "#22c55e",
              minHeight:   42,
            }}
          >
            {result || "—"}
          </motion.div>
        </div>
      </div>

      {/* Conversion label */}
      {result && (
        <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
          {input} {from.symbol} = <span style={{ color: "#22c55e" }}>{result} {to.symbol}</span>
        </p>
      )}
    </div>
  );
}
