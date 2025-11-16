/**
 * Cost Calculator API Route
 *
 * Endpoints:
 * - POST /api/calculator - Calculate total landed cost
 * - GET /api/calculator/ports - Get all available ports
 * - GET /api/calculator/countries - Get all countries with duty info
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  calculateLandedCost,
  getAllPorts,
  getAllCountries,
  getPortsByCountry,
  type Port,
  type Country,
} from '@/lib/data/cost-calculator';
import { calculateCostSchema, getPortsByCountrySchema } from '@/lib/validations/calculator';
import { calculatorRateLimiter, getClientIp } from '@/lib/ratelimit';

/**
 * POST /api/calculator
 * Calculate total landed cost for a vehicle
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (by IP for public endpoint)
    const clientIp = getClientIp(request.headers);
    const { success, remaining, reset } = await calculatorRateLimiter.limit(clientIp);

    if (!success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded. Please try again later.',
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(reset).toISOString(),
          },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = calculateCostSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { fob_price, port, currency } = validationResult.data;

    // Calculate cost
    const calculation = calculateLandedCost(fob_price, port, currency);

    if (!calculation) {
      return NextResponse.json(
        { error: 'Invalid port or calculation failed' },
        { status: 400 }
      );
    }

    // Add port details to response
    const [country, portName] = port.split('-');
    const response = {
      ...calculation,
      port_details: {
        country,
        port_name: portName,
      },
    };

    return NextResponse.json(
      response,
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': remaining.toString(),
        },
      }
    );
  } catch (error) {
    console.error('Cost calculator error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calculator/ports?country={country}
 * Get all available ports (optionally filtered by country)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get('country');

    if (country) {
      // Validate country
      const validationResult = getPortsByCountrySchema.safeParse({ country });

      if (!validationResult.success) {
        return NextResponse.json(
          {
            error: 'Invalid country',
            details: validationResult.error.issues,
          },
          { status: 400 }
        );
      }

      const ports = getPortsByCountry(country as Country);
      const portDetails = getAllPorts().filter(p => ports.includes(p.id));

      return NextResponse.json({
        country,
        ports: portDetails,
      });
    }

    // Return all ports
    const ports = getAllPorts();
    return NextResponse.json({ ports });
  } catch (error) {
    console.error('Ports API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
