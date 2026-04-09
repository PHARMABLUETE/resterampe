import { NextResponse } from 'next/server';

export async function POST() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const res = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`n8n antwortete mit ${res.status}`);
    }

    return NextResponse.json({ ok: true, triggered_at: new Date().toISOString() });
  } catch (err) {
    console.error('Refresh Fehler:', err);
    return NextResponse.json({ error: 'Sync konnte nicht gestartet werden' }, { status: 500 });
  } finally {
    clearTimeout(timeout);
  }
}
