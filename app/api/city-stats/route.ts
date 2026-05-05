import { NextResponse } from 'next/server';
import { getWeatherData } from '@/lib/city-data';
import { getPharmacyData } from '@/lib/pharmacy-data';

export async function GET() {
  try {
    const [weather, pharmacies] = await Promise.all([
      getWeatherData(),
      getPharmacyData()
    ]);

    return NextResponse.json({
      weather,
      pharmacies,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch city stats' },
      { status: 500 }
    );
  }
}
