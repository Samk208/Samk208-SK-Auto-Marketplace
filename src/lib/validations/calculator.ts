/**
 * Zod Validation Schemas for Cost Calculator
 *
 * This module defines runtime validation schemas for:
 * - Cost calculation requests
 * - Port and country queries
 */

import { z } from 'zod';
import {
  SHIPPING_RATES,
  DUTY_RATES,
  SUPPORTED_CURRENCIES,
  type Port,
  type Country,
  type Currency,
} from '@/lib/data/cost-calculator';

/**
 * Schema for port validation
 */
export const portSchema = z.enum(
  Object.keys(SHIPPING_RATES) as [Port, ...Port[]]
);

/**
 * Schema for country validation
 */
export const countrySchema = z.enum(
  Object.keys(DUTY_RATES) as [Country, ...Country[]]
);

/**
 * Schema for currency validation
 */
export const currencySchema = z.enum(SUPPORTED_CURRENCIES);

/**
 * Schema for cost calculation request
 */
export const calculateCostSchema = z.object({
  fob_price: z
    .number()
    .positive('FOB price must be positive')
    .max(1000000, 'FOB price seems unrealistic (max $1,000,000)'),
  port: portSchema,
  currency: currencySchema.optional().default('USD'),
});

export type CalculateCostInput = z.infer<typeof calculateCostSchema>;

/**
 * Schema for cost calculation response
 */
export const costCalculationResponseSchema = z.object({
  currency: currencySchema,
  fob_price: z.number(),
  fob_price_usd: z.number(),
  shipping_cost: z.number(),
  import_duty: z.number(),
  total_cost: z.number(),
  estimated_days: z.number(),
  breakdown: z.object({
    fob_percentage: z.string(),
    shipping_percentage: z.string(),
    duty_percentage: z.string(),
  }),
  duty_info: z.object({
    rate: z.number(),
    description: z.string(),
    notes: z.string(),
  }),
  port_details: z.object({
    country: z.string(),
    port_name: z.string(),
  }),
});

export type CostCalculationResponse = z.infer<typeof costCalculationResponseSchema>;

/**
 * Schema for getting ports by country
 */
export const getPortsByCountrySchema = z.object({
  country: countrySchema,
});

export type GetPortsByCountryInput = z.infer<typeof getPortsByCountrySchema>;

/**
 * Schema for port details response
 */
export const portDetailsSchema = z.object({
  id: portSchema,
  country: z.string(),
  port_name: z.string(),
  shipping_cost: z.number(),
  estimated_days: z.number(),
});

export type PortDetails = z.infer<typeof portDetailsSchema>;

/**
 * Schema for country details response
 */
export const countryDetailsSchema = z.object({
  name: countrySchema,
  duty_rate: z.number(),
  description: z.string(),
  notes: z.string(),
  ports: z.array(portDetailsSchema),
});

export type CountryDetails = z.infer<typeof countryDetailsSchema>;

/**
 * Helper function to validate port string
 */
export function isValidPort(port: string): port is Port {
  return port in SHIPPING_RATES;
}

/**
 * Helper function to validate country string
 */
export function isValidCountry(country: string): country is Country {
  return country in DUTY_RATES;
}

/**
 * Helper function to validate currency string
 */
export function isValidCurrency(currency: string): currency is Currency {
  return SUPPORTED_CURRENCIES.includes(currency as Currency);
}
