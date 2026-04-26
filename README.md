# CodPartner COD Calculator

Profit calculator built on the official **CodPartner 2024 tariff** for COD fulfillment across UAE, KSA, Kuwait, Qatar, Oman, Bahrain, and Iraq.

## What's included

- **Per-country shipping rates** (Free Plan and Free Return Plan)
- **Plan-aware fulfillment fees** ($0 Free Plan, $1 Free Return Plan)
- **Call-center pricing** by product type (Gadget vs Cosmetic)
- **5% COD service fee** applied to delivered revenue
- **Weight surcharge** ($1/kg over 5 kg)
- **Side-by-side plan comparison** with auto-recommendation
- **Local currency display** (AED / SAR / KWD / QAR / OMR / BHD / IQD)

## Stack

Next.js 15 • React 19 • TypeScript • Tailwind v4 • lucide-react

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel

```bash
vercel
```

Or connect this repo to Vercel via the dashboard — no environment variables needed.

## File structure

```
web/
├── app/
│   ├── components/ui.tsx     # Field, Select, Toggle, StatCard, Row primitives
│   ├── globals.css           # Tailwind v4 + brand tokens
│   ├── layout.tsx
│   └── page.tsx              # Main calculator page
├── lib/
│   ├── tariff.ts             # CodPartner tariff data (PLANS, COUNTRIES, CALL_CENTER)
│   └── calculator.ts         # calculate() + comparePlans()
├── next.config.ts
├── package.json
├── postcss.config.mjs
└── tsconfig.json
```

## Updating the tariff

Edit `lib/tariff.ts`. The `PLANS` object has per-country `delivered` / `returned` rates per plan. The `CALL_CENTER` object has Lead / Confirmed / Delivered / Upsell pricing per product type.
