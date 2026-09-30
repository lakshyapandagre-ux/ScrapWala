import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const latStr = searchParams.get('lat');
  const lngStr = searchParams.get('lng') || searchParams.get('lon');

  if (!latStr || !lngStr) {
    return NextResponse.json(
      { error: 'Missing lat or lng parameter' },
      { status: 400 }
    );
  }

  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);

  const locationIqKey = process.env.LOCATIONIQ_API_KEY;

  // 1. Try LocationIQ if key is provided and not dummy
  if (locationIqKey && locationIqKey !== 'your_key_here') {
    try {
      const resp = await fetch(
        `https://us1.locationiq.com/v1/reverse?key=${encodeURIComponent(
          locationIqKey
        )}&lat=${lat}&lon=${lng}&format=json`,
        { next: { revalidate: 3600 } }
      );
      if (resp.ok) {
        const data = await resp.json();
        const addr = data.address || {};
        const locality =
          addr.suburb ||
          addr.city_district ||
          addr.neighbourhood ||
          addr.town ||
          addr.village ||
          addr.city ||
          'अज्ञात स्थान';
        return NextResponse.json({
          locality,
          district: addr.state_district || addr.county || 'Indore',
          state: addr.state || 'Madhya Pradesh',
          display_name: data.display_name,
        });
      }
    } catch {
      // Fall through to Nominatim
    }
  }

  // 2. OpenStreetMap Nominatim Fallback (free, keyless)
  try {
    const resp = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
      {
        headers: {
          'User-Agent': 'ScrapWala/2.0 (SIH-26229; https://scrapwala.app)',
        },
        next: { revalidate: 3600 },
      }
    );
    if (resp.ok) {
      const data = await resp.json();
      const addr = data.address || {};
      const locality =
        addr.suburb ||
        addr.city_district ||
        addr.neighbourhood ||
        addr.town ||
        addr.village ||
        addr.city ||
        'अज्ञात स्थान';
      return NextResponse.json({
        locality,
        district: addr.state_district || addr.county || 'Indore',
        state: addr.state || 'Madhya Pradesh',
        display_name: data.display_name,
      });
    }
  } catch {
    // Fall through
  }

  // 3. Fallback default
  return NextResponse.json({
    locality: 'Indore, MP',
    district: 'Indore',
    state: 'Madhya Pradesh',
    display_name: `${lat.toFixed(4)}, ${lng.toFixed(4)}, Indore, Madhya Pradesh`,
  });
}
