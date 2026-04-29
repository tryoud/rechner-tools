import type { APIRoute } from 'astro';
import { calculateStundenrechner, calculateStundensatz } from '../lib/calculators';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { tool, input } = body;

    let result;
    switch (tool) {
      case 'stundenrechner':
        result = calculateStundenrechner(input);
        break;
      case 'stundensatz':
        result = calculateStundensatz(input);
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown tool' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
