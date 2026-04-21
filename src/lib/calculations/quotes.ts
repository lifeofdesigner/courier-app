import type {
  PricingRuleRecord,
  QuoteBreakdown,
  QuoteFormInput,
  QuoteZone,
  ServiceType,
} from "@/types/quote";

const euCountries = new Set([
  "austria",
  "belgium",
  "bulgaria",
  "croatia",
  "cyprus",
  "czech republic",
  "czechia",
  "denmark",
  "estonia",
  "finland",
  "france",
  "germany",
  "greece",
  "hungary",
  "ireland",
  "italy",
  "latvia",
  "lithuania",
  "luxembourg",
  "malta",
  "netherlands",
  "poland",
  "portugal",
  "romania",
  "slovakia",
  "slovenia",
  "spain",
  "sweden",
]);

function normalizeCountry(country: string) {
  return country.trim().toLowerCase();
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function determineQuoteZone(
  originCountry: string,
  destinationCountry: string,
): QuoteZone {
  return euCountries.has(normalizeCountry(originCountry)) &&
    euCountries.has(normalizeCountry(destinationCountry))
    ? "EU"
    : "International";
}

export function calculateQuoteBreakdown(
  input: QuoteFormInput,
  pricingRules: PricingRuleRecord[],
): QuoteBreakdown {
  const zone = determineQuoteZone(input.originCountry, input.destinationCountry);
  const matchingRules = pricingRules
    .filter(
      (rule) =>
        rule.isActive &&
        rule.serviceType === input.serviceType &&
        rule.zone === zone,
    )
    .sort((a, b) => a.priority - b.priority);

  const rule =
    matchingRules.find(
      (pricingRule) =>
        input.weightKg >= pricingRule.minWeightKg &&
        (pricingRule.maxWeightKg === null ||
          input.weightKg <= pricingRule.maxWeightKg),
    ) ?? matchingRules[0];

  if (!rule) {
    throw new Error(
      `No active ${input.serviceType as ServiceType} pricing rule is available for ${zone}.`,
    );
  }

  const subtotal = roundMoney(
    rule.basePrice + Math.max(input.weightKg - 1, 0) * rule.perKgPrice,
  );
  const fuelSurcharge = roundMoney(
    subtotal * (rule.fuelSurchargeRate / 100),
  );
  const remoteAreaSurcharge = 0;
  const total = roundMoney(subtotal + fuelSurcharge + remoteAreaSurcharge);

  return {
    zone,
    subtotal,
    fuelSurcharge,
    remoteAreaSurcharge,
    total,
    currency: "EUR",
    matchedRuleName: rule.name,
  };
}
