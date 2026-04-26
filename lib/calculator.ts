import {
  PLANS, CALL_CENTER, COUNTRIES,
  type PlanKey, type CountryCode, type ProductType,
  EXTRA_WEIGHT_PER_KG, FREE_WEIGHT_LIMIT_KG,
} from "./tariff";

export interface CalculatorInputs {
  // Tariff
  plan: PlanKey;
  country: CountryCode;
  productType: ProductType;
  useCallCenter: boolean;

  // Inventory & pricing
  stockQuantity: number;
  productCost: number;
  sellingPrice: number;
  weightKg: number;

  // Marketing
  leadCost: number;
  confirmationRate: number;   // 0-100
  deliveryRate: number;       // 0-100  (% kept)
  refundRate: number;         // 0-100
  upsellRate: number;         // 0-100

  // Influencer
  influencerCount: number;
  influencerCostPerVideo: number;

  // Operating
  employeeCount: number;
  salaryPerEmployee: number;
  rentCost: number;
  internetCost: number;
  electricityCost: number;
  otherCosts: number;
  taxRate: number;            // 0-100

  // Video review refund
  enableVideoRefund: boolean;
  videoAcceptance: number;    // 0-100
  videoRefundPct: number;     // 0-100
}

export interface CalculatorResults {
  // Tariff applied
  planName: string;
  countryName: string;
  countryFlag: string;
  productType: ProductType;
  useCallCenter: boolean;
  deliveredShip: number;
  returnedShip: number;
  fulfillmentRate: number;
  codPct: number;
  extraWeightFee: number;

  // Volume
  leadsNeeded: number;
  confirmedOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  returnedOrders: number;
  upsellOrders: number;

  // Revenue
  grossRevenue: number;
  upsellRevenue: number;
  totalGross: number;
  refunds: number;
  videoRefundAmount: number;
  codFees: number;
  netRevenue: number;

  // Direct costs
  cogs: number;
  shippingDelivered: number;
  shippingReturned: number;
  shippingTotal: number;
  fulfillmentTotal: number;
  callCenter: {
    lead: number;
    confirmed: number;
    delivered: number;
    upsell: number;
    total: number;
  };
  adCost: number;
  influencerTotal: number;
  directCosts: number;

  // Operating
  salariesTotal: number;
  operatingTotal: number;

  // Profit
  profitBeforeTax: number;
  businessTax: number;
  netProfit: number;

  // KPIs
  roi: number;
  margin: number;
  profitPerUnit: number;
  breakEvenLeads: number;

  // Local currency
  localCurrency: string;
  localProfit: number;

  // Validation
  errors: string[];
}

export function calculate(input: CalculatorInputs): CalculatorResults {
  const errors: string[] = [];

  const plan = PLANS[input.plan];
  const ship = plan.shipping[input.country];
  const cc = CALL_CENTER[input.productType];
  const country = COUNTRIES.find(c => c.code === input.country)!;

  const confRate = input.confirmationRate / 100;
  const delivRate = input.deliveryRate / 100;
  const refundRate = input.refundRate / 100;
  const upsellRate = input.upsellRate / 100;
  const taxRate = input.taxRate / 100;
  const successRatio = confRate * delivRate;

  if (successRatio <= 0) {
    errors.push("Confirmation rate × delivery rate must be greater than 0.");
  }
  if (input.sellingPrice <= input.productCost) {
    errors.push("Selling price is at or below product cost — review your numbers.");
  }

  // Weight surcharge
  const extraKg = Math.max(0, input.weightKg - FREE_WEIGHT_LIMIT_KG);
  const extraWeightFee = extraKg * EXTRA_WEIGHT_PER_KG;
  const deliveredShip = ship.delivered + extraWeightFee;
  const returnedShip = ship.returned + (ship.returned > 0 ? extraWeightFee : 0);

  // Volume math
  const leadsNeeded = successRatio > 0 ? input.stockQuantity / successRatio : 0;
  const confirmedOrders = leadsNeeded * confRate;
  const shippedOrders = confirmedOrders;
  const deliveredOrders = input.stockQuantity;
  const returnedOrders = Math.max(0, shippedOrders - deliveredOrders);
  const upsellOrders = deliveredOrders * upsellRate;

  // Revenue
  const grossRevenue = deliveredOrders * input.sellingPrice;
  const upsellRevenue = upsellOrders * input.sellingPrice;
  const totalGross = grossRevenue + upsellRevenue;
  const refunds = totalGross * refundRate;
  const videoRefundAmount = input.enableVideoRefund
    ? deliveredOrders * input.sellingPrice * (input.videoAcceptance / 100) * (input.videoRefundPct / 100)
    : 0;
  const codFees = totalGross * (plan.codFeesPct / 100);
  const netRevenue = totalGross - refunds - videoRefundAmount - codFees;

  // COGS (delivered + upsell units)
  const cogs = (deliveredOrders + upsellOrders) * input.productCost;

  // Shipping
  const shippingDelivered = deliveredOrders * deliveredShip;
  const shippingReturned = returnedOrders * returnedShip;
  const shippingTotal = shippingDelivered + shippingReturned;

  // Fulfillment ($1/order on Free Return Plan, $0 on Free Plan)
  const fulfillmentTotal = shippedOrders * plan.fulfillmentPerOrder;

  // Call center
  const ccLead = input.useCallCenter ? leadsNeeded * cc.lead : 0;
  const ccConfirmed = input.useCallCenter ? confirmedOrders * cc.confirmed : 0;
  const ccDelivered = input.useCallCenter ? deliveredOrders * cc.delivered : 0;
  const ccUpsell = input.useCallCenter ? upsellOrders * cc.upsell : 0;
  const ccTotal = ccLead + ccConfirmed + ccDelivered + ccUpsell;

  // Marketing
  const adCost = leadsNeeded * input.leadCost;
  const influencerVideo = input.influencerCount * input.influencerCostPerVideo;
  const influencerProduct = input.influencerCount * input.productCost;
  const influencerShipping = input.influencerCount * deliveredShip;
  const influencerTotal = influencerVideo + influencerProduct + influencerShipping;

  const directCosts = cogs + shippingTotal + fulfillmentTotal + ccTotal + adCost + influencerTotal;

  // Operating
  const salariesTotal = input.employeeCount * input.salaryPerEmployee;
  const operatingTotal = salariesTotal + input.rentCost + input.internetCost
    + input.electricityCost + input.otherCosts;

  // Profit
  const profitBeforeTax = netRevenue - directCosts - operatingTotal;
  const businessTax = Math.max(0, profitBeforeTax) * taxRate;
  const netProfit = profitBeforeTax - businessTax;

  // KPIs
  const invested = directCosts;
  const roi = invested > 0 ? (netProfit / invested) * 100 : 0;
  const margin = totalGross > 0 ? (netProfit / totalGross) * 100 : 0;
  const profitPerUnit = deliveredOrders > 0 ? netProfit / deliveredOrders : 0;

  // Break-even leads (how many leads to cover monthly operating + tax)
  const profitPerLead = leadsNeeded > 0
    ? (netRevenue - directCosts) / leadsNeeded
    : 0;
  const breakEvenLeads = profitPerLead > 0 ? operatingTotal / profitPerLead : 0;

  return {
    planName: plan.name,
    countryName: country.name,
    countryFlag: country.flag,
    productType: input.productType,
    useCallCenter: input.useCallCenter,
    deliveredShip,
    returnedShip,
    fulfillmentRate: plan.fulfillmentPerOrder,
    codPct: plan.codFeesPct,
    extraWeightFee,

    leadsNeeded,
    confirmedOrders,
    shippedOrders,
    deliveredOrders,
    returnedOrders,
    upsellOrders,

    grossRevenue,
    upsellRevenue,
    totalGross,
    refunds,
    videoRefundAmount,
    codFees,
    netRevenue,

    cogs,
    shippingDelivered,
    shippingReturned,
    shippingTotal,
    fulfillmentTotal,
    callCenter: {
      lead: ccLead,
      confirmed: ccConfirmed,
      delivered: ccDelivered,
      upsell: ccUpsell,
      total: ccTotal,
    },
    adCost,
    influencerTotal,
    directCosts,

    salariesTotal,
    operatingTotal,

    profitBeforeTax,
    businessTax,
    netProfit,

    roi,
    margin,
    profitPerUnit,
    breakEvenLeads,

    localCurrency: country.currency,
    localProfit: netProfit * country.usdRate,

    errors,
  };
}

// Compare both plans for the same scenario
export function comparePlans(input: CalculatorInputs): {
  free: CalculatorResults;
  freeReturn: CalculatorResults;
  recommendation: PlanKey;
} {
  const free = calculate({ ...input, plan: "free" });
  const freeReturn = calculate({ ...input, plan: "free_return" });
  const recommendation: PlanKey = free.netProfit >= freeReturn.netProfit ? "free" : "free_return";
  return { free, freeReturn, recommendation };
}
