/**
 * Tra một lá trong data/v4/year-YYYY.jsonl.zst.
 * Không có file năm 2002 thì bỏ qua (máy CI không kèm bộ dữ liệu).
 */
import assert from 'node:assert/strict';
import { datasetFileForYear, lookupDatasetReading } from '../../lib/ziwei/dataset-reading';

async function main() {
  if (!datasetFileForYear(2002)) {
    console.log('dataset reading regression skipped (data/v4/year-2002.jsonl.zst missing)');
    return;
  }

  const male = await lookupDatasetReading({ year: 2002, month: 1, day: 1, hour: 0, gender: 'male' });
  assert.ok(male?.overview.includes('**【命格总览】**'), 'nam 2002-01-01 giờ Tý có tổng quan');
  assert.equal(typeof male?.love, 'string');

  const female = await lookupDatasetReading({ year: 2002, month: 1, day: 1, hour: 0, gender: 'female' });
  assert.ok(female?.overview.includes('**【命格总览】**'));
  assert.notEqual(male?.overview, female?.overview, 'nam và nữ không dùng chung một bài');

  const cached = await lookupDatasetReading({ year: 2002, month: 1, day: 1, hour: 0, gender: 'male' });
  assert.equal(cached, male, 'lần tra sau dùng bộ nhớ đệm');

  const missingYear = await lookupDatasetReading({ year: 1999, month: 1, day: 1, hour: 0, gender: 'male' });
  assert.equal(missingYear, null);

  console.log('dataset reading regression passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
