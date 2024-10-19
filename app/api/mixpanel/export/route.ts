import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fromDate = searchParams.get('from_date') || '';
  const toDate = searchParams.get('to_date') || '';
  const whereClause = searchParams.get('where') || '';

  const options = {
    method: 'GET',
    headers: {
      accept: 'text/plain',
      authorization: `Basic ${process.env.MIXPANEL_AUTH_TOKEN}`, // Ensure your Base64 encoded token is in the environment variable
    },
  };

  const mixpanelUrl = `https://data.mixpanel.com/api/2.0/export?from_date=${fromDate}&to_date=${toDate}&where=${encodeURIComponent(whereClause)}`;

  try {
    const response = await fetch(mixpanelUrl, options);

    // Check if the response is OK (status in the range 200-299)
    if (!response.ok) {
      const errorText = await response.text();  // Capture the error text if the response is not OK
      throw new Error(`Failed to fetch Mixpanel data: ${errorText}`);
    }

    const data = await response.text();  // Get NDJSON response as plain text

    // Split NDJSON by newlines and parse each line as JSON
    const events = data.split('\n').filter(Boolean).map(event => JSON.parse(event));

    return NextResponse.json(events);  // Return the array of parsed events
  } catch (error) {
    // Log detailed error for debugging
    console.error('Error fetching Mixpanel data:', error);
    return NextResponse.json({ error: 'Failed to fetch Mixpanel data' }, { status: 500 });
  }
}
