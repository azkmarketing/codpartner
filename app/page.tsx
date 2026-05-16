"use client";

import { useMemo, useState } from "react";
import {
  Package, DollarSign, TrendingUp, Phone, Users, Building2,
  Video, Globe, Truck, Calculator, Sparkles, BarChart3,
  AlertCircle, CheckCircle2, ArrowRight, Info, Clock, ShoppingCart,
} from "lucide-react";
import { calculate, comparePlans, type CalculatorInputs } from "@/lib/calculator";
import { COUNTRIES, type CountryCode, type PlanKey, type ProductType } from "@/lib/tariff";
import { Field, NumberInput, Select, Toggle, Section, StatCard, Row } from "./components/ui";

const fmt = (n: number, dp = 2) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });
const fmtUSD = (n: number) => `$${fmt(n)}`;
const fmtInt = (n: number) => Math.round(n).toLocaleString("en-US");

export default function HomePage() {
  const [inputs, setInputs] = useState<CalculatorInputs>({
    plan: "free",
    country: "KSA",
    productType: "Cosmetic",
    useCallCenter: true,

    stockQuantity: 100,
    productCost: 16.5,
    sellingPrice: 95.72,
    weightKg: 0.55,

    // AOV / leads mode
    useLeadsMode: false,
    leadsInput: 1000,
    aov: 0,

    leadCost: 14,
    confirmationRate: 65,
    deliveryRate: 60,
    refundRate: 0,
    upsellRate: 2,

    influencerCount: 0,
    influencerCostPerVideo: 100,

    employeeCount: 0,
    salaryPerEmployee: 0,
    rentCost: 0,
    internetCost: 0,
    electricityCost: 0,
    otherCosts: 0,
    taxRate: 0,

    enableVideoRefund: false,
    videoAcceptance: 30,
    videoRefundPct: 35,

    // Supply chain
    productionDays: 25,
    shippingDays: 25,
    safetyStockDays: 10,
  });

  const update = <K extends keyof CalculatorInputs>(key: K, value: CalculatorInputs[K]) =>
    setInputs((s) => ({ ...s, [key]: value }));

  const result = useMemo(() => calculate(inputs), [inputs]);
  const comparison = useMemo(() => comparePlans(inputs), [inputs]);

  const countryOpts = COUNTRIES.map((c) => ({
    value: c.code as CountryCode,
    label: `${c.flag}  ${c.name} (${c.code})`,
  }));

  const profitable = result.netProfit >= 0;
  const planSavings = Math.abs(comparison.free.netProfit - comparison.freeReturn.netProfit);
  const sc = result.supplyChain;

  const urgencyConfig = {
    ok: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-600", label: "On Track" },
    soon: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badge: "bg-amber-500", label: "Order Soon" },
    urgent: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badge: "bg-orange-600", label: "Order Now" },
    overdue: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-700", badge: "bg-rose-600", label: "OVERDUE" },
  }[sc.reorderUrgency];

  return (
    <main className="min-h-screen pb-16">
      {/* Header */}
      <header className="border-b border-slate-200/70 bg-white/80 backdrop-blur sticky top-0 z-10 no-print">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">CodPartner Calculator</h1>
              <p className="text-[11px] text-slate-500">GCC & Iraq • Official 2024 tariff</p>
            </div>
          </div>
          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            Export PDF
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Hero */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-brand-800 p-6 text-white shadow-xl shadow-brand-500/20">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-brand-200 text-xs font-medium">
                <Sparkles className="h-3.5 w-3.5" />
                Real-time profit analysis
              </div>
              <h2 className="mt-2 text-2xl font-bold sm:text-3xl">Plan your COD profit margins</h2>
              <p className="mt-1 max-w-xl text-sm text-brand-100">
                Pick a country and CodPartner plan. We apply the exact tariff for shipping, fulfillment, COD service fees, and call-center pricing — then show you which plan keeps more of your money.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="rounded-xl bg-white/10 p-4 backdrop-blur">
                <div className="text-xs text-brand-200">Net profit on this scenario</div>
                <div className={`mt-1 text-3xl font-bold ${profitable ? "text-emerald-300" : "text-rose-300"}`}>
                  {fmtUSD(result.netProfit)}
                </div>
                <div className="mt-1 text-xs text-brand-200">
                  ROI {fmt(result.roi, 1)}% • Margin {fmt(result.margin, 1)}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
          {/* LEFT: Inputs */}
          <div className="space-y-4">
            {/* Tariff selector */}
            <Section title="Tariff Setup" icon={<Globe className="h-4 w-4 text-brand-600" />}>
              <div className="sm:col-span-2">
                <Field label="Country" hint="Per-country shipping rates apply">
                  <Select<CountryCode>
                    value={inputs.country}
                    onChange={(v) => update("country", v)}
                    options={countryOpts}
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Plan" hint="Affects shipping & fulfillment fees">
                  <div className="grid grid-cols-2 gap-2">
                    {(["free", "free_return"] as PlanKey[]).map((p) => {
                      const active = inputs.plan === p;
                      const isFree = p === "free";
                      return (
                        <button
                          key={p}
                          type="button"
                          onClick={() => update("plan", p)}
                          className={`rounded-xl border p-3 text-left transition ${
                            active
                              ? "border-brand-500 bg-brand-50 ring-2 ring-brand-500/20"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className={`text-sm font-semibold ${active ? "text-brand-700" : "text-slate-900"}`}>
                            {isFree ? "Free Plan" : "Free Return"}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500 leading-tight">
                            {isFree ? "Pay for delivered + returned" : "$7.99 delivered, $0 return"}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </Field>
              </div>

              <Field label="Product Type" hint="Sets call-center fees">
                <Select<ProductType>
                  value={inputs.productType}
                  onChange={(v) => update("productType", v)}
                  options={[
                    { value: "Gadget", label: "Gadget" },
                    { value: "Cosmetic", label: "Cosmetic" },
                  ]}
                />
              </Field>

              <Field label="Use CodPartner Call Center?">
                <div className="flex items-center gap-3 pt-1">
                  <Toggle checked={inputs.useCallCenter} onChange={(v) => update("useCallCenter", v)} />
                  <span className="text-sm text-slate-600">{inputs.useCallCenter ? "Active" : "Disabled"}</span>
                </div>
              </Field>
            </Section>

            {/* Inventory & Pricing */}
            <Section title="Inventory & Pricing" icon={<Package className="h-4 w-4 text-brand-600" />}>
              <Field label="Stock Quantity"><NumberInput value={inputs.stockQuantity} onChange={(v) => update("stockQuantity", v)} suffix="units" /></Field>
              <Field label="Package Weight"><NumberInput value={inputs.weightKg} onChange={(v) => update("weightKg", v)} suffix="kg" /></Field>
              <Field label="Product Cost" hint="Per unit"><NumberInput value={inputs.productCost} onChange={(v) => update("productCost", v)} prefix="$" /></Field>
              <Field label="Selling Price" hint="Single unit price"><NumberInput value={inputs.sellingPrice} onChange={(v) => update("sellingPrice", v)} prefix="$" /></Field>
            </Section>

            {/* AOV & Leads Mode */}
            <Section title="AOV & Leads Mode" icon={<ShoppingCart className="h-4 w-4 text-brand-600" />}>
              <div className="sm:col-span-2">
                <Field label="Calculate from leads instead of stock?">
                  <div className="flex items-center gap-3 pt-1">
                    <Toggle checked={inputs.useLeadsMode} onChange={(v) => update("useLeadsMode", v)} />
                    <span className="text-sm text-slate-600">{inputs.useLeadsMode ? "Leads-driven" : "Stock-driven"}</span>
                  </div>
                </Field>
              </div>
              {inputs.useLeadsMode && (
                <div className="sm:col-span-2">
                  <Field label="Number of Leads" hint="How many leads you have/expect">
                    <NumberInput value={inputs.leadsInput} onChange={(v) => update("leadsInput", v)} suffix="leads" />
                  </Field>
                </div>
              )}
              <div className="sm:col-span-2">
                <Field label="AOV (Average Order Value)" hint="Overrides selling price if set. Set to 0 to use selling price.">
                  <NumberInput value={inputs.aov} onChange={(v) => update("aov", v)} prefix="$" />
                </Field>
              </div>
              <div className="sm:col-span-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-500">
                Effective price used: <strong className="text-slate-700">{fmtUSD(result.effectivePrice)}</strong>
                {inputs.aov > 0 ? " (from AOV)" : " (from selling price)"}
              </div>
            </Section>

            <Section title="Marketing" icon={<TrendingUp className="h-4 w-4 text-brand-600" />}>
              <Field label="Cost per Lead"><NumberInput value={inputs.leadCost} onChange={(v) => update("leadCost", v)} prefix="$" /></Field>
              <Field label="Confirmation Rate"><NumberInput value={inputs.confirmationRate} onChange={(v) => update("confirmationRate", v)} suffix="%" /></Field>
              <Field label="Delivery Success Rate" hint="% kept by customer"><NumberInput value={inputs.deliveryRate} onChange={(v) => update("deliveryRate", v)} suffix="%" /></Field>
              <Field label="Refund Rate"><NumberInput value={inputs.refundRate} onChange={(v) => update("refundRate", v)} suffix="%" /></Field>
              <Field label="Upsell Rate" hint="% buying 2+ units"><NumberInput value={inputs.upsellRate} onChange={(v) => update("upsellRate", v)} suffix="%" /></Field>
            </Section>

            {/* Supply Chain */}
            <Section title="Supply Chain" icon={<Clock className="h-4 w-4 text-brand-600" />}>
              <div className="sm:col-span-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-[11px] text-slate-500 leading-relaxed">
                Total lead time = production + shipping. Reorder point = daily sales × (lead time + safety buffer).
              </div>
              <Field label="Production Days" hint="Time to make in China"><NumberInput value={inputs.productionDays} onChange={(v) => update("productionDays", v)} suffix="days" /></Field>
              <Field label="Shipping Days" hint="Transit to warehouse"><NumberInput value={inputs.shippingDays} onChange={(v) => update("shippingDays", v)} suffix="days" /></Field>
              <div className="sm:col-span-2">
                <Field label="Safety Buffer" hint="Extra days stock to hold before reordering">
                  <NumberInput value={inputs.safetyStockDays} onChange={(v) => update("safetyStockDays", v)} suffix="days" />
                </Field>
              </div>
            </Section>

            <Section title="Influencer Marketing" icon={<Video className="h-4 w-4 text-brand-600" />}>
              <Field label="# of Influencers"><NumberInput value={inputs.influencerCount} onChange={(v) => update("influencerCount", v)} /></Field>
              <Field label="Cost per Video"><NumberInput value={inputs.influencerCostPerVideo} onChange={(v) => update("influencerCostPerVideo", v)} prefix="$" /></Field>
            </Section>

            <Section title="Monthly Operating" icon={<Building2 className="h-4 w-4 text-brand-600" />}>
              <Field label="Employees"><NumberInput value={inputs.employeeCount} onChange={(v) => update("employeeCount", v)} /></Field>
              <Field label="Salary per Employee"><NumberInput value={inputs.salaryPerEmployee} onChange={(v) => update("salaryPerEmployee", v)} prefix="$" suffix="/mo" /></Field>
              <Field label="Rent"><NumberInput value={inputs.rentCost} onChange={(v) => update("rentCost", v)} prefix="$" suffix="/mo" /></Field>
              <Field label="Internet"><NumberInput value={inputs.internetCost} onChange={(v) => update("internetCost", v)} prefix="$" suffix="/mo" /></Field>
              <Field label="Electricity"><NumberInput value={inputs.electricityCost} onChange={(v) => update("electricityCost", v)} prefix="$" suffix="/mo" /></Field>
              <Field label="Other"><NumberInput value={inputs.otherCosts} onChange={(v) => update("otherCosts", v)} prefix="$" suffix="/mo" /></Field>
              <div className="sm:col-span-2">
                <Field label="Business Tax Rate"><NumberInput value={inputs.taxRate} onChange={(v) => update("taxRate", v)} suffix="%" /></Field>
              </div>
            </Section>

            <Section title="Video Review Refund" icon={<Sparkles className="h-4 w-4 text-brand-600" />}>
              <div className="sm:col-span-2">
                <Field label="Offer video review refund?">
                  <div className="flex items-center gap-3 pt-1">
                    <Toggle checked={inputs.enableVideoRefund} onChange={(v) => update("enableVideoRefund", v)} />
                    <span className="text-sm text-slate-600">{inputs.enableVideoRefund ? "Enabled" : "Disabled"}</span>
                  </div>
                </Field>
              </div>
              {inputs.enableVideoRefund && (
                <>
                  <Field label="% Customers Accepting"><NumberInput value={inputs.videoAcceptance} onChange={(v) => update("videoAcceptance", v)} suffix="%" /></Field>
                  <Field label="Refund % of Price"><NumberInput value={inputs.videoRefundPct} onChange={(v) => update("videoRefundPct", v)} suffix="%" /></Field>
                </>
              )}
            </Section>
          </div>

          {/* RIGHT: Results */}
          <div className="space-y-4">
            {/* Errors */}
            {result.errors.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 mt-0.5 text-amber-600 shrink-0" />
                  <div className="space-y-1">
                    {result.errors.map((e, i) => (
                      <p key={i} className="text-xs text-amber-800">{e}</p>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Headline KPIs */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Net Profit"
                value={fmtUSD(result.netProfit)}
                sub={`≈ ${fmt(result.localProfit, 0)} ${result.localCurrency}`}
                tone={profitable ? "positive" : "negative"}
              />
              <StatCard label="ROI" value={`${fmt(result.roi, 1)}%`} tone={result.roi >= 0 ? "brand" : "negative"} />
              <StatCard label="Margin" value={`${fmt(result.margin, 1)}%`} tone={result.margin >= 0 ? "neutral" : "negative"} />
              <StatCard label="Per Unit Profit" value={fmtUSD(result.profitPerUnit)} tone={result.profitPerUnit >= 0 ? "neutral" : "negative"} />
            </div>

            {/* Supply Chain Tracker */}
            <div className={`rounded-2xl border p-5 shadow-sm ${urgencyConfig.bg} ${urgencyConfig.border}`}>
              <div className="mb-4 flex items-center justify-between">
                <h3 className={`flex items-center gap-2 text-sm font-semibold ${urgencyConfig.text}`}>
                  <Clock className="h-4 w-4" />
                  Supply Chain Tracker
                </h3>
                <span className={`inline-flex items-center gap-1 rounded-full ${urgencyConfig.badge} px-2.5 py-0.5 text-[10px] font-bold uppercase text-white`}>
                  {urgencyConfig.label}
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-4">
                <ScStat label="Total Lead Time" value={`${sc.totalLeadTime} days`} sub={`${inputs.productionDays}d prod + ${inputs.shippingDays}d ship`} />
                <ScStat label="Daily Sales Rate" value={`${sc.dailySalesRate} units/day`} sub="based on current stock" />
                <ScStat label="Stock Lasts" value={`${sc.daysUntilStockout} days`} sub="at current sales pace" />
                <ScStat label="Reorder Point" value={`${fmtInt(sc.reorderPoint)} units`} sub="min stock to trigger order" />
              </div>

              <div className={`rounded-xl border ${urgencyConfig.border} bg-white/60 p-4`}>
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${urgencyConfig.text}`}>
                      Place Next Order In
                    </div>
                    <div className={`mt-0.5 text-2xl font-bold tabular-nums ${urgencyConfig.text}`}>
                      {sc.reorderInDays <= 0 ? "Now!" : `${sc.reorderInDays} days`}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {sc.reorderInDays <= 0
                        ? "Order already overdue — stock may run out before new batch arrives"
                        : `Order by ${sc.reorderDate} to avoid stockout`}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-500">Lead time breakdown</div>
                    <div className="text-xs text-slate-700 font-medium mt-1">
                      {inputs.productionDays}d production + {inputs.shippingDays}d shipping + {inputs.safetyStockDays}d buffer
                    </div>
                    <div className="text-xs text-slate-500">= {sc.totalLeadTime + inputs.safetyStockDays} days total window</div>
                  </div>
                </div>

                {/* Timeline bar */}
                <div className="mt-4">
                  <div className="flex text-[10px] text-slate-500 justify-between mb-1">
                    <span>Today</span>
                    <span>Order deadline</span>
                    <span>Stockout risk</span>
                  </div>
                  <div className="relative h-3 rounded-full bg-slate-200 overflow-hidden">
                    {/* safety zone */}
                    <div
                      className="absolute left-0 top-0 h-full bg-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, sc.daysUntilStockout > 0 ? (sc.reorderInDays / sc.daysUntilStockout) * 100 : 0)}%` }}
                    />
                    {/* lead time zone */}
                    <div
                      className="absolute top-0 h-full bg-amber-400"
                      style={{
                        left: `${Math.min(100, sc.daysUntilStockout > 0 ? (sc.reorderInDays / sc.daysUntilStockout) * 100 : 0)}%`,
                        width: `${Math.min(100, sc.daysUntilStockout > 0 ? (sc.totalLeadTime / sc.daysUntilStockout) * 100 : 100)}%`,
                      }}
                    />
                  </div>
                  <div className="flex text-[10px] gap-3 mt-1.5">
                    <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-emerald-400" />Safe window</span>
                    <span className="flex items-center gap-1"><span className="inline-block w-2 h-2 rounded-sm bg-amber-400" />Lead time in transit</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Plan comparison */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <BarChart3 className="h-4 w-4 text-brand-600" />
                  Plan Comparison
                </h3>
                <span className="text-[11px] text-slate-500">Same scenario, both plans</span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {(["free", "free_return"] as PlanKey[]).map((p) => {
                  const data = p === "free" ? comparison.free : comparison.freeReturn;
                  const isWinner = comparison.recommendation === p;
                  const isActive = inputs.plan === p;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => update("plan", p)}
                      className={`rounded-xl border p-4 text-left transition ${
                        isWinner
                          ? "border-emerald-300 bg-emerald-50/50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      } ${isActive ? "ring-2 ring-brand-500/30" : ""}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-600">
                          {p === "free" ? "Free Plan" : "Free Return Plan"}
                        </span>
                        {isWinner && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            <CheckCircle2 className="h-3 w-3" /> Best
                          </span>
                        )}
                      </div>
                      <div className={`mt-1 text-2xl font-bold tabular-nums ${data.netProfit >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                        {fmtUSD(data.netProfit)}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-2 text-[11px] text-slate-500">
                        <div>
                          <div>Shipping</div>
                          <div className="font-semibold text-slate-700">{fmtUSD(data.shippingTotal)}</div>
                        </div>
                        <div>
                          <div>Fulfillment</div>
                          <div className="font-semibold text-slate-700">{fmtUSD(data.fulfillmentTotal)}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              {planSavings > 1 && (
                <p className="mt-3 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
                  <Info className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  Switching plans changes profit by <strong className="font-semibold text-slate-900 mx-1">{fmtUSD(planSavings)}</strong> for this scenario.
                </p>
              )}
            </div>

            {/* Tariff applied */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Truck className="h-4 w-4 text-brand-600" />
                CodPartner Tariff Applied
              </h3>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">Selected</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">
                    {result.countryFlag} {result.countryName}
                  </div>
                  <div className="text-xs text-slate-500">{result.planName} • {result.productType}</div>
                </div>
                <div className="rounded-lg bg-slate-50 p-3">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">COD Service Fee</div>
                  <div className="mt-1 text-sm font-semibold text-slate-900">{fmt(result.codPct, 1)}% of revenue</div>
                  <div className="text-xs text-slate-500">{fmtUSD(result.codFees)} on this run</div>
                </div>
                <Row label="Delivered shipping" value={`${fmtUSD(result.deliveredShip)} / order`} />
                <Row label="Returned shipping" value={`${fmtUSD(result.returnedShip)} / order`} />
                <Row label="Fulfillment" value={`${fmtUSD(result.fulfillmentRate)} / shipped`} />
                {result.extraWeightFee > 0 && (
                  <Row label="Weight surcharge" value={`+${fmtUSD(result.extraWeightFee)}`} tone="warn" />
                )}
              </div>
            </div>

            {/* Volume funnel */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Users className="h-4 w-4 text-brand-600" />
                Volume Funnel
                {inputs.useLeadsMode
                  ? ` (from ${fmtInt(inputs.leadsInput)} leads)`
                  : ` (to deliver ${fmtInt(result.deliveredOrders)} units)`}
              </h3>
              <div className="space-y-1">
                <FunnelRow label="Leads" value={fmtInt(result.leadsNeeded)} pct={100} />
                <FunnelRow label="Confirmed orders" value={fmtInt(result.confirmedOrders)}
                  pct={(result.confirmedOrders / result.leadsNeeded) * 100} />
                <FunnelRow label="Shipped" value={fmtInt(result.shippedOrders)}
                  pct={(result.shippedOrders / result.leadsNeeded) * 100} />
                <FunnelRow label="Delivered (kept)" value={fmtInt(result.deliveredOrders)}
                  pct={(result.deliveredOrders / result.leadsNeeded) * 100} positive />
                <FunnelRow label="Returned" value={fmtInt(result.returnedOrders)}
                  pct={(result.returnedOrders / result.leadsNeeded) * 100} negative />
                {result.upsellOrders > 0 && (
                  <FunnelRow label="Upsell orders" value={fmtInt(result.upsellOrders)}
                    pct={(result.upsellOrders / result.leadsNeeded) * 100} />
                )}
              </div>
              {inputs.useLeadsMode && (
                <p className="mt-3 rounded-lg bg-brand-50 border border-brand-100 px-3 py-2 text-xs text-brand-700">
                  With <strong>{fmtInt(inputs.leadsInput)} leads</strong> at your rates → <strong>{fmtInt(result.deliveredOrders)} delivered units</strong> • Revenue: <strong>{fmtUSD(result.totalGross)}</strong>
                </p>
              )}
            </div>

            {/* P&L */}
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                  Revenue
                </h3>
                <div className="divide-y divide-slate-100">
                  <Row label={`Gross revenue (${fmtUSD(result.effectivePrice)}/unit)`} value={fmtUSD(result.grossRevenue)} />
                  <Row label="Upsell revenue" value={fmtUSD(result.upsellRevenue)} />
                  <Row label="Total gross" value={fmtUSD(result.totalGross)} strong />
                  <Row label="− Refunds" value={fmtUSD(result.refunds)} tone="warn" />
                  {result.videoRefundAmount > 0 && (
                    <Row label="− Video refunds" value={fmtUSD(result.videoRefundAmount)} tone="warn" />
                  )}
                  <Row label={`− COD fee (${fmt(result.codPct, 1)}%)`} value={fmtUSD(result.codFees)} tone="warn" />
                </div>
                <div className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Net Revenue</span>
                  <span className="text-sm font-bold text-emerald-700 tabular-nums">{fmtUSD(result.netRevenue)}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Truck className="h-4 w-4 text-rose-600" />
                  Direct Costs
                </h3>
                <div className="divide-y divide-slate-100">
                  <Row label="Product COGS" value={fmtUSD(result.cogs)} />
                  <Row label="Shipping (delivered)" value={fmtUSD(result.shippingDelivered)} />
                  <Row label="Shipping (returned)" value={fmtUSD(result.shippingReturned)} />
                  {result.fulfillmentTotal > 0 && (
                    <Row label="Fulfillment" value={fmtUSD(result.fulfillmentTotal)} />
                  )}
                  {result.useCallCenter && (
                    <Row label="Call center" value={fmtUSD(result.callCenter.total)} />
                  )}
                  <Row label="Ad spend" value={fmtUSD(result.adCost)} />
                  {result.influencerTotal > 0 && (
                    <Row label="Influencer" value={fmtUSD(result.influencerTotal)} />
                  )}
                </div>
                <div className="mt-3 rounded-lg bg-rose-50 px-3 py-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-rose-700">Total Direct</span>
                  <span className="text-sm font-bold text-rose-700 tabular-nums">{fmtUSD(result.directCosts)}</span>
                </div>
              </div>
            </div>

            {/* Call center detail */}
            {result.useCallCenter && (
              <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Phone className="h-4 w-4 text-brand-600" />
                  Call Center Breakdown ({result.productType})
                </h3>
                <div className="grid gap-3 sm:grid-cols-4">
                  <CCStat label="Lead fee" value={result.callCenter.lead} />
                  <CCStat label="Confirmed" value={result.callCenter.confirmed} />
                  <CCStat label="Delivered" value={result.callCenter.delivered} />
                  <CCStat label="Upsell" value={result.callCenter.upsell} />
                </div>
              </div>
            )}

            {/* Operating + final */}
            <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                <Building2 className="h-4 w-4 text-slate-600" />
                Operating & Final P&L
              </h3>
              <div className="divide-y divide-slate-100">
                {result.salariesTotal > 0 && <Row label="Salaries" value={fmtUSD(result.salariesTotal)} />}
                <Row label="Operating subtotal" value={fmtUSD(result.operatingTotal)} strong />
                <Row label="Net revenue" value={fmtUSD(result.netRevenue)} tone="positive" />
                <Row label="− Direct costs" value={fmtUSD(result.directCosts)} tone="warn" />
                <Row label="− Operating" value={fmtUSD(result.operatingTotal)} tone="warn" />
                <Row label="Profit before tax" value={fmtUSD(result.profitBeforeTax)}
                     tone={result.profitBeforeTax >= 0 ? "positive" : "negative"} strong />
                {result.businessTax > 0 && <Row label="− Business tax" value={fmtUSD(result.businessTax)} tone="warn" />}
              </div>
              <div className={`mt-4 rounded-xl p-4 flex items-center justify-between ${
                profitable ? "bg-gradient-to-r from-emerald-50 to-emerald-100" : "bg-gradient-to-r from-rose-50 to-rose-100"
              }`}>
                <div>
                  <div className={`text-[11px] font-bold uppercase tracking-wider ${profitable ? "text-emerald-700" : "text-rose-700"}`}>
                    Net Profit
                  </div>
                  <div className={`text-[10px] ${profitable ? "text-emerald-600" : "text-rose-600"}`}>
                    ≈ {fmt(result.localProfit, 0)} {result.localCurrency}
                  </div>
                </div>
                <div className={`text-3xl font-bold tabular-nums ${profitable ? "text-emerald-700" : "text-rose-700"}`}>
                  {fmtUSD(result.netProfit)}
                </div>
              </div>
              {result.breakEvenLeads > 0 && result.operatingTotal > 0 && (
                <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <ArrowRight className="h-3 w-3" />
                  Break-even at <strong className="mx-1 font-semibold text-slate-700">{fmtInt(result.breakEvenLeads)} leads/month</strong>
                  to cover operating costs.
                </p>
              )}
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-slate-400">
          Built on the official CodPartner 2024 tariff. Always verify with your account manager before launching.
        </footer>
      </div>
    </main>
  );
}

function FunnelRow({ label, value, pct, positive, negative }: {
  label: string; value: string; pct: number;
  positive?: boolean; negative?: boolean;
}) {
  const color = positive ? "bg-emerald-500" : negative ? "bg-rose-400" : "bg-brand-500";
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="w-32 text-xs text-slate-600 shrink-0">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full ${color} transition-all`} style={{ width: `${Math.min(100, Math.max(0, pct))}%` }} />
      </div>
      <span className="w-20 text-right text-xs font-semibold text-slate-900 tabular-nums">{value}</span>
    </div>
  );
}

function CCStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-base font-semibold text-slate-900 tabular-nums">${fmt(value, 2)}</div>
    </div>
  );
}

function ScStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg bg-white/70 border border-white/80 p-3">
      <div className="text-[11px] uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-bold text-slate-800">{value}</div>
      <div className="text-[10px] text-slate-400 mt-0.5">{sub}</div>
    </div>
  );
}
