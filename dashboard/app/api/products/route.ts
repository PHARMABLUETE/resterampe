import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch(process.env.N8N_DATA_URL!, { cache: 'no-store' });
    if (!res.ok) throw new Error(`n8n antwortete mit ${res.status}`);
    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error('Fehler beim Laden der Produkte:', err);
    return NextResponse.json({ error: 'Daten konnten nicht geladen werden' }, { status: 500 });
  }
}
