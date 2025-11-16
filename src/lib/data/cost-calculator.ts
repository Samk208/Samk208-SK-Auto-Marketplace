/**
 * Cost Calculator Data and Utilities
 *
 * This module provides shipping rates, duty rates, and calculation logic
 * for the total landed cost of importing cars from Korea to Africa.
 *
 * Total Landed Cost = FOB Price + Shipping + Import Duties
 */

/**
 * Shipping costs by port (in USD)
 * Format: "Country-PortName"
 *
 * Note: These are approximate rates and should be updated from actual
 * shipping providers periodically.
 */
export const SHIPPING_RATES = {
  'Nigeria-Lagos': { base: 1200, perUnit: 0, estimatedDays: 35 },
  'Nigeria-Port Harcourt': { base: 1300, perUnit: 0, estimatedDays: 38 },
  'Nigeria-Calabar': { base: 1350, perUnit: 0, estimatedDays: 40 },
  'Kenya-Mombasa': { base: 1500, perUnit: 0, estimatedDays: 30 },
  'Kenya-Kilindini': { base: 1550, perUnit: 0, estimatedDays: 31 },
  'Ghana-Tema': { base: 1400, perUnit: 0, estimatedDays: 33 },
  'Ghana-Takoradi': { base: 1450, perUnit: 0, estimatedDays: 35 },
  'Senegal-Dakar': { base: 1600, perUnit: 0, estimatedDays: 37 },
  'Tanzania-Dar es Salaam': { base: 1550, perUnit: 0, estimatedDays: 32 },
  'South Africa-Durban': { base: 1700, perUnit: 0, estimatedDays: 40 },
  'South Africa-Cape Town': { base: 1750, perUnit: 0, estimatedDays: 42 },
  'Ivory Coast-Abidjan': { base: 1450, perUnit: 0, estimatedDays: 34 },
  'Cameroon-Douala': { base: 1500, perUnit: 0, estimatedDays: 36 },
  'Ethiopia-Djibouti': { base: 1650, perUnit: 0, estimatedDays: 33 },
} as const;

/**
 * Import duty rates by country (percentage of FOB price)
 *
 * Note: These rates are approximate and may vary based on:
 * - Vehicle age
 * - Engine size
 * - Vehicle type
 * - Trade agreements
 *
 * Always advise buyers to verify with local customs.
 */
export const DUTY_RATES = {
  Nigeria: {
    base: 0.35, // 35%
    description: 'Import duty + VAT + Levies',
    notes: 'Rates vary by vehicle age and engine size',
  },
  Kenya: {
    base: 0.45, // 45%
    description: 'Import duty + VAT + IDF + RDL',
    notes: 'Additional environmental levy for older vehicles',
  },
  Ghana: {
    base: 0.30, // 30%
    description: 'Import duty + VAT + NHIL + COVID levy',
    notes: 'Lower rates for vehicles under 10 years old',
  },
  Senegal: {
    base: 0.40, // 40%
    description: 'Import duty + VAT + Statistical tax',
    notes: 'ECOWAS member - some exemptions may apply',
  },
  Tanzania: {
    base: 0.42, // 42%
    description: 'Import duty + VAT + Withholding tax',
    notes: 'EAC member - preferential rates available',
  },
  'South Africa': {
    base: 0.38, // 38%
    description: 'Ad valorem duty + VAT',
    notes: 'SACU member - specific rates by vehicle type',
  },
  'Ivory Coast': {
    base: 0.37, // 37%
    description: 'Import duty + VAT + Customs fees',
    notes: 'ECOWAS member - exemptions may apply',
  },
  Cameroon: {
    base: 0.41, // 41%
    description: 'Import duty + VAT + Special levies',
    notes: 'CEMAC member - regional integration considerations',
  },
  Ethiopia: {
    base: 0.50, // 50%
    description: 'Import duty + VAT + Surtax + Excise',
    notes: 'High import duties to protect local assembly',
  },
} as const;

/**
 * Supported currencies
 */
export const SUPPORTED_CURRENCIES = ['USD', 'KRW', 'EUR'] as const;

/**
 * Exchange rates (against USD)
 * Note: In production, these should be fetched from a real-time API
 */
export const EXCHANGE_RATES = {
  USD: 1,
  KRW: 0.00076, // 1 KRW = 0.00076 USD (approximate)
  EUR: 1.09, // 1 EUR = 1.09 USD (approximate)
} as const;

/**
 * Type definitions
 */
export type Port = keyof typeof SHIPPING_RATES;
export type Country = keyof typeof DUTY_RATES;
export type Currency = typeof SUPPORTED_CURRENCIES[number];

/**
 * Get country from port string
 * Example: "Nigeria-Lagos" -> "Nigeria"
 */
export function getCountryFromPort(port: Port): Country | null {
  const country = port.split('-')[0] as Country;
  return country in DUTY_RATES ? country : null;
}

/**
 * Get all ports for a specific country
 */
export function getPortsByCountry(country: Country): Port[] {
  return Object.keys(SHIPPING_RATES).filter(
    port => port.startsWith(`${country}-`)
  ) as Port[];
}

/**
 * Convert price to USD
 */
export function convertToUSD(amount: number, currency: Currency): number {
  return amount * EXCHANGE_RATES[currency];
}

/**
 * Calculate total landed cost
 */
export interface CostCalculation {
  currency: Currency;
  fobPrice: number;
  fobPriceUSD: number;
  shippingCost: number;
  importDuty: number;
  totalCost: number;
  estimatedDays: number;
  breakdown: {
    fobPercentage: string;
    shippingPercentage: string;
    dutyPercentage: string;
  };
  dutyInfo: {
    rate: number;
    description: string;
    notes: string;
  };
}

export function calculateLandedCost(
  fobPrice: number,
  port: Port,
  currency: Currency = 'USD'
): CostCalculation | null {
  // Validate port
  if (!(port in SHIPPING_RATES)) {
    return null;
  }

  // Get country and validate
  const country = getCountryFromPort(port);
  if (!country) {
    return null;
  }

  // Convert FOB to USD if needed
  const fobPriceUSD = convertToUSD(fobPrice, currency);

  // Get shipping cost
  const shipping = SHIPPING_RATES[port];

  // Calculate import duty
  const dutyRate = DUTY_RATES[country];
  const importDuty = fobPriceUSD * dutyRate.base;

  // Calculate total
  const totalCost = fobPriceUSD + shipping.base + importDuty;

  return {
    currency,
    fobPrice,
    fobPriceUSD,
    shippingCost: shipping.base,
    importDuty,
    totalCost,
    estimatedDays: shipping.estimatedDays,
    breakdown: {
      fobPercentage: ((fobPriceUSD / totalCost) * 100).toFixed(1),
      shippingPercentage: ((shipping.base / totalCost) * 100).toFixed(1),
      dutyPercentage: ((importDuty / totalCost) * 100).toFixed(1),
    },
    dutyInfo: {
      rate: dutyRate.base * 100, // Convert to percentage
      description: dutyRate.description,
      notes: dutyRate.notes,
    },
  };
}

/**
 * Get all available ports with their details
 */
export function getAllPorts(): Array<{
  id: Port;
  country: string;
  portName: string;
  shippingCost: number;
  estimatedDays: number;
}> {
  return Object.entries(SHIPPING_RATES).map(([port, details]) => {
    const [country, portName] = port.split('-');
    return {
      id: port as Port,
      country,
      portName,
      shippingCost: details.base,
      estimatedDays: details.estimatedDays,
    };
  });
}

/**
 * Get all countries with their duty information
 */
export function getAllCountries(): Array<{
  name: Country;
  dutyRate: number;
  description: string;
  notes: string;
  ports: Port[];
}> {
  return Object.entries(DUTY_RATES).map(([country, info]) => ({
    name: country as Country,
    dutyRate: info.base * 100,
    description: info.description,
    notes: info.notes,
    ports: getPortsByCountry(country as Country),
  }));
}
