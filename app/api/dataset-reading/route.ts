import { NextRequest, NextResponse } from 'next/server';
import { datasetKey, lookupDatasetReading, type DatasetQuery } from '@/lib/ziwei/dataset-reading';
import { translateDatasetTopics } from '@/lib/ziwei/translate-reading';

export const dynamic = 'force-dynamic';
export const maxDuration = 300;

function intIn(raw: string | null, min: number, max: number): number | null {
  if (raw == null || !/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < min || n > max) return null;
  return n;
}

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const year = intIn(q.get('y'), 1900, 2100);
  const month = intIn(q.get('m'), 1, 12);
  const day = intIn(q.get('d'), 1, 31);
  const hour = intIn(q.get('h'), 0, 11);
  const gender = q.get('g');
  if (year == null || month == null || day == null || hour == null) {
    return NextResponse.json({ ok: false, reason: 'bad-query' }, { status: 400 });
  }
  if (gender !== 'male' && gender !== 'female') {
    return NextResponse.json({ ok: false, reason: 'bad-query' }, { status: 400 });
  }

  try {
    const query: DatasetQuery = {
      year,
      month,
      day,
      hour,
      gender: gender === 'female' ? 'female' : 'male',
    };
    const topics = await lookupDatasetReading(query);
    if (!topics) return NextResponse.json({ ok: false, reason: 'not-found' });
    if (q.get('lang') !== 'vi') return NextResponse.json({ ok: true, topics });

    try {
      const result = await translateDatasetTopics({ key: datasetKey(query), topics });
      return NextResponse.json({
        ok: true,
        topics: result.topics,
        translated: result.translated,
        ...(result.reason ? { reason: result.reason } : {}),
      });
    } catch {
      return NextResponse.json({ ok: true, topics, translated: false, reason: 'translate-failed' });
    }
  } catch {
    return NextResponse.json({ ok: false, reason: 'read-failed' }, { status: 500 });
  }
}
