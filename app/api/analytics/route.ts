import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    
    const data = await req.json();

    const from_date = data.fromDate;
    const to_date = data.toDate;
    const distinct_id = data.id;

    const mixpanelUrl = `https://data.mixpanel.com/api/2.0/export?from_date=${from_date}&to_date=${to_date}&where=properties%5B%22%24distinct_id%22%5D%3D%3D%22${distinct_id}%22`;

    try {
      const response = await fetch(mixpanelUrl, {
        method: 'GET',
          headers: {
            accept: 'text/plain',
            Authorization: `Basic ${process.env.MIXPANEL_API_AUTH_KEY}`,
        },
      });        
  
      if (!response.ok) {
        throw new Error('Failed to fetch Mixpanel data');
      }
  
        const data = await response.text();
        // Parse NDJSON data (each line is a JSON object)
        const events = data
        .split('\n')
        .filter(line => line.trim())  // Filter out any empty lines
        .map(event => JSON.parse(event));

        return NextResponse.json(events, { status: 200 });
    } catch (error) {
      console.error('Error fetching Mixpanel data:', error);
      return NextResponse.json({ error: 'Failed to fetch Mixpanel data' }, { status: 500 });
    }
}
