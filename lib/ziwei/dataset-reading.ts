/**
 * Đọc một lá trong bộ luận giải v4.0 (data/v4/year-YYYY.jsonl.zst).
 * File nén zstd cửa sổ dài 27. Dòng xếp theo ngày, rồi giờ 0–11, nam rồi nữ,
 * nên khi khóa đã đi qua thì dừng, không giải nén hết năm.
 */
import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';
import { existsSync } from 'node:fs';
import path from 'node:path';

export type DatasetTopics = Record<string, string>;

export interface DatasetQuery {
  year: number;
  month: number;
  day: number;
  hour: number;
  gender: 'male' | 'female';
}

type Rank = [number, number, number, number, number];

const cache = new Map<string, DatasetTopics | null>();

export function datasetKey(q: DatasetQuery): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${q.year}-${p(q.month)}-${p(q.day)}-${q.hour}-${q.gender}`;
}

function keyRank(key: string): Rank | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})-(\d{1,2})-(male|female)$/.exec(key);
  if (!m) return null;
  return [Number(m[1]), Number(m[2]), Number(m[3]), Number(m[4]), m[5] === 'male' ? 0 : 1];
}

function compareRank(a: Rank, b: Rank): number {
  for (let i = 0; i < 5; i++) {
    if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
  }
  return 0;
}

export function datasetFileForYear(year: number): string | null {
  if (!Number.isInteger(year) || year < 1900 || year > 2100) return null;
  const file = path.join(process.cwd(), 'data', 'v4', `year-${year}.jsonl.zst`);
  return existsSync(file) ? file : null;
}

export async function lookupDatasetReading(q: DatasetQuery): Promise<DatasetTopics | null> {
  const key = datasetKey(q);
  if (cache.has(key)) return cache.get(key) ?? null;
  const file = datasetFileForYear(q.year);
  const target = keyRank(key);
  if (!file || !target) {
    cache.set(key, null);
    return null;
  }
  const topics = await scanYearFile(file, target);
  cache.set(key, topics);
  return topics;
}

function scanYearFile(file: string, target: Rank): Promise<DatasetTopics | null> {
  return new Promise((resolve, reject) => {
    const child = spawn('zstd', ['-d', '--long=27', '-c', file], {
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const rl = createInterface({ input: child.stdout! });
    let settled = false;

    const finish = (value: DatasetTopics | null) => {
      if (settled) return;
      settled = true;
      child.stdout?.destroy();
      rl.close();
      child.kill('SIGKILL');
      child.unref();
      resolve(value);
    };

    child.on('error', (err) => {
      if (settled) return;
      settled = true;
      reject(err);
    });

    rl.on('line', (line) => {
      const km = /^\{"k":"([^"]+)"/.exec(line);
      if (!km) return;
      const rank = keyRank(km[1]);
      if (!rank) return;
      const order = compareRank(rank, target);
      if (order < 0) return;
      if (order > 0) {
        finish(null);
        return;
      }
      try {
        const row = JSON.parse(line) as { c?: DatasetTopics };
        const topics = row.c;
        finish(topics && typeof topics.overview === 'string' ? topics : null);
      } catch {
        finish(null);
      }
    });

    rl.on('close', () => finish(null));
  });
}
