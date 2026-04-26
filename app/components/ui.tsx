"use client";

import { ReactNode } from "react";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between mb-1.5">
        <span className="text-[13px] font-medium text-slate-700">{label}</span>
        {hint && <span className="text-[11px] text-slate-400">{hint}</span>}
      </div>
      {children}
    </label>
  );
}

export function NumberInput({
  value, onChange, placeholder, prefix, suffix, step = "any",
}: {
  value: number | string;
  onChange: (v: number) => void;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  step?: string;
}) {
  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">{prefix}</span>
      )}
      <input
        type="number"
        inputMode="decimal"
        step={step}
        value={value}
        onChange={(e) => {
          const v = e.target.value;
          onChange(v === "" ? 0 : parseFloat(v));
        }}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-200 bg-white py-2.5 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 ${prefix ? "pl-7" : "pl-3"} ${suffix ? "pr-10" : "pr-3"}`}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs pointer-events-none">{suffix}</span>
      )}
    </div>
  );
}

export function Select<T extends string>({
  value, onChange, options,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 py-2.5 pr-9 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clipRule="evenodd"/></svg>
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${checked ? "bg-brand-600" : "bg-slate-300"}`}
      aria-label={label}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

export function Section({ title, icon, children }: { title: string; icon?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-slate-800">
        {icon}
        {title}
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

export function StatCard({ label, value, sub, tone = "neutral" }: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "positive" | "negative" | "brand";
}) {
  const tones = {
    neutral: "bg-slate-50 border-slate-200",
    positive: "bg-emerald-50 border-emerald-200",
    negative: "bg-rose-50 border-rose-200",
    brand: "bg-brand-50 border-brand-200",
  };
  const valueTones = {
    neutral: "text-slate-900",
    positive: "text-emerald-700",
    negative: "text-rose-700",
    brand: "text-brand-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone]}`}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className={`mt-1 text-xl font-bold ${valueTones[tone]}`}>{value}</div>
      {sub && <div className="mt-0.5 text-[11px] text-slate-500">{sub}</div>}
    </div>
  );
}

export function Row({ label, value, tone = "neutral", strong = false }: {
  label: string;
  value: string;
  tone?: "neutral" | "positive" | "negative" | "warn" | "muted";
  strong?: boolean;
}) {
  const tones = {
    neutral: "text-slate-700",
    positive: "text-emerald-600",
    negative: "text-rose-600",
    warn: "text-amber-600",
    muted: "text-slate-400",
  };
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className={`${tones[tone]} ${strong ? "font-semibold" : ""}`}>{label}</span>
      <span className={`tabular-nums ${tones[tone]} ${strong ? "font-semibold" : ""}`}>{value}</span>
    </div>
  );
}
