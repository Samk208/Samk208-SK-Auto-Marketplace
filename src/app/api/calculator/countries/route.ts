/**
 * Countries API Route for Cost Calculator
 *
 * GET /api/calculator/countries - Get all countries with duty information
 */

import { NextResponse } from 'next/server';
import { getAllCountries } from '@/lib/data/cost-calculator';

/**
 * GET /api/calculator/countries
 * Get all supported countries with their duty rates and ports
 */
export async function GET() {
  try {
    const countries = getAllCountries();

    return NextResponse.json({
      countries,
      count: countries.length,
    });
  } catch (error) {
    console.error('Countries API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
