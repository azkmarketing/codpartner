// CodPartner 2024 official tariff (per provided PDF)

export type CountryCode = "UAE" | "KSA" | "Kuwait" | "Qatar" | "Oman" | "Bahrain" | "Iraq";
export type PlanKey = "free" | "free_return";
export type ProductType = "Gadget" | "Cosmetic";

export interface ShippingRate {
  delivered: number;
  returned: number;
}

export interface PlanData {
  key: PlanKey;
  name: string;
  description: string;
  subscription: number;
  callCenterSubscription: number;
  codFeesPct: number;
  fulfillmentPerOrder: number;
  storage: number;
  labeling: number;
  shipping: Record<CountryCode, ShippingRate>;
}

export const PLANS: Record<PlanKey, PlanData> = {
  free: {
    key: "free",
    name: "Free Plan",
    description: "Standard plan — pay for both delivered and returned shipments. Best for high delivery rates (KSA especially, with cheap $2.99 returns).",
    subscription: 0,
    callCenterSubscription: 0,
    codFeesPct: 5.0,
    fulfillmentPerOrder: 0,
    storage: 0,
    labeling: 0,
    shipping: {
      UAE:     { delivered: 4.99, returned: 4.99 },
      KSA:     { delivered: 4.99, returned: 2.99 },
      Kuwait:  { delivered: 5.99, returned: 5.99 },
      Qatar:   { delivered: 5.99, returned: 5.99 },
      Oman:    { delivered: 5.99, returned: 5.99 },
      Bahrain: { delivered: 5.99, returned: 5.99 },
      Iraq:    { delivered: 4.99, returned: 4.99 },
    },
  },
  free_return: {
    key: "free_return",
    name: "Free Return Plan",
    description: "Pay nothing on returns — flat $7.99 per delivered order plus $1 fulfillment per shipped order. Best for low delivery rates and risky niches.",
    subscription: 0,
    callCenterSubscription: 0,
    codFeesPct: 5.0,
    fulfillmentPerOrder: 1.0,
    storage: 0,
    labeling: 0,
    shipping: {
      UAE:     { delivered: 7.99, returned: 0 },
      KSA:     { delivered: 7.99, returned: 0 },
      Kuwait:  { delivered: 7.99, returned: 0 },
      Qatar:   { delivered: 7.99, returned: 0 },
      Oman:    { delivered: 7.99, returned: 0 },
      Bahrain: { delivered: 7.99, returned: 0 },
      Iraq:    { delivered: 7.99, returned: 0 },
    },
  },
};

export interface CallCenterPricing {
  lead: number;
  confirmed: number;
  delivered: number;
  upsell: number;
}

export const CALL_CENTER: Record<ProductType, CallCenterPricing> = {
  Gadget:   { lead: 0.5, confirmed: 1.0, delivered: 2.0, upsell: 1.0 },
  Cosmetic: { lead: 0.5, confirmed: 2.0, delivered: 3.0, upsell: 1.0 },
};

export interface CountryInfo {
  code: CountryCode;
  name: string;
  flag: string;
  currency: string;
  usdRate: number;  // 1 USD ≈ this many local
}

export const COUNTRIES: CountryInfo[] = [
  { code: "UAE",     name: "United Arab Emirates", flag: "🇦🇪", currency: "AED", usdRate: 3.67 },
  { code: "KSA",     name: "Saudi Arabia",          flag: "🇸🇦", currency: "SAR", usdRate: 3.75 },
  { code: "Kuwait",  name: "Kuwait",                flag: "🇰🇼", currency: "KWD", usdRate: 0.31 },
  { code: "Qatar",   name: "Qatar",                 flag: "🇶🇦", currency: "QAR", usdRate: 3.64 },
  { code: "Oman",    name: "Oman",                  flag: "🇴🇲", currency: "OMR", usdRate: 0.385 },
  { code: "Bahrain", name: "Bahrain",               flag: "🇧🇭", currency: "BHD", usdRate: 0.376 },
  { code: "Iraq",    name: "Iraq",                  flag: "🇮🇶", currency: "IQD", usdRate: 1310 },
];

export const EXTRA_WEIGHT_PER_KG = 1.0;
export const FREE_WEIGHT_LIMIT_KG = 5.0;
