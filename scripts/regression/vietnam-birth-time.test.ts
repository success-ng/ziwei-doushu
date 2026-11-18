/**
 * 越南出生钟表时间：民用时 UTC+7，中央经线 105°E。
 *
 * 中国不传 utcOffsetMinutes，经度修正仍是 (经度 − 120) × 4，不走均时差。
 * 越南传 420，修正是 (经度 − 105) × 4。河内 105.8° 约为 +3.2 分钟，不是相对 120° 的 −56.8 分钟。
 */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { PROVINCES, VIETNAM_CITIES, VIETNAM_DEFAULT_LONGITUDE, VIETNAM_UTC_OFFSET_MINUTES } from '../../lib/ziwei/cities';
import { calcTrueSolarBranch, formToBirthInfo, formToSearchParams, searchParamsToForm, solarMeridian } from '../../lib/ziwei/share';
import type { BirthFormState } from '../../components/BirthForm';

const shareSrc = readFileSync(new URL('../../lib/ziwei/share.ts', import.meta.url), 'utf8');
assert.equal(shareSrc.includes('calculateTrueSolarTime'), false, '排盘换日仍用经度修正，不改走 calculateTrueSolarTime');
assert.equal(shareSrc.includes('equationOfTime'), false, '中国与越南表单路径都不加均时差');

assert.equal(VIETNAM_UTC_OFFSET_MINUTES, 420);
assert.equal(VIETNAM_DEFAULT_LONGITUDE, 105.8);
assert.equal(solarMeridian(undefined), 120);
assert.equal(solarMeridian(480), 120);
assert.equal(solarMeridian(420), 105);

const requiredCities: Array<[string, number]> = [
  ['Hà Nội', 105.8],
  ['Điện Biên', 103.0],
  ['Quảng Ninh', 107.1],
  ['Hải Phòng', 106.7],
  ['Nghệ An', 105.7],
  ['Thừa Thiên Huế', 107.6],
  ['Đà Nẵng', 108.2],
  ['Khánh Hòa', 109.2],
  ['Đắk Lắk', 108.0],
  ['TP. Hồ Chí Minh', 106.7],
  ['Cần Thơ', 105.8],
  ['Cà Mau', 105.2],
];
assert.equal(VIETNAM_CITIES.length, 63, '合并前的 63 个省级单位');
assert.equal(new Set(VIETNAM_CITIES.map(city => city.name)).size, 63, '省名不重复');
for (const retired of ['Hạ Long', 'Vinh', 'Huế', 'Nha Trang', 'Buôn Ma Thuột']) {
  assert.equal(VIETNAM_CITIES.some(city => city.name === retired), false, retired);
}
for (const [name, longitude] of requiredCities) {
  assert.equal(VIETNAM_CITIES.find(city => city.name === name)?.longitude, longitude, name);
}
assert.equal(
  PROVINCES.some(province => province.cities.some(city => city.name === 'Hà Nội')),
  false,
  '越南城市不进中国省市列表',
);

function legacyBranch(clockHour: number, clockMinute: number, longitude: number): number {
  const solar = ((clockHour * 60 + clockMinute + (longitude - 120) * 4) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

assert.equal(calcTrueSolarBranch(14, 0, 116.4), legacyBranch(14, 0, 116.4), '不传偏移：北京 116.4° 仍按 (经度−120)×4');
assert.equal(calcTrueSolarBranch(9, 16, 116.4), legacyBranch(9, 16, 116.4));
assert.equal(calcTrueSolarBranch(23, 30, 100), legacyBranch(23, 30, 100));
assert.equal(calcTrueSolarBranch(14, 0, 116.4, 480), legacyBranch(14, 0, 116.4), '显式 480 与省略偏移同为东经 120°');

const hanoiCorrection = (105.8 - 105) * 4;
const mistakenMeridian120 = (105.8 - 120) * 4;
assert.ok(Math.abs(hanoiCorrection - 3.2) < 1e-6, '河内经度修正约 +3.2 分钟');
assert.ok(Math.abs(mistakenMeridian120 - (-56.8)) < 1e-6, '误用 120° 经线会得到约 −56.8 分钟');
assert.ok(hanoiCorrection > 0 && hanoiCorrection < 10);

function branchFromClockPlus(clockHour: number, clockMinute: number, correctionMinutes: number): number {
  const solar = ((clockHour * 60 + clockMinute + correctionMinutes) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

assert.equal(calcTrueSolarBranch(14, 0, 105.8, 420), branchFromClockPlus(14, 0, hanoiCorrection));
assert.equal(calcTrueSolarBranch(14, 0, 105.8, 420), 7, '14:00 河内加 3.2 分钟仍是未时');
assert.equal(calcTrueSolarBranch(14, 30, 105.8, 420), 7);
assert.equal(calcTrueSolarBranch(1, 10, 105.8, 420), 1, '01:10 河内是丑时');
assert.equal(calcTrueSolarBranch(2, 40, 105.8, 420), 1, '02:40 河内仍是丑时，没有多加 1 小时');
assert.equal(branchFromClockPlus(2, 40, hanoiCorrection + 60), 2, '若多加 60 分钟，02:40 会变成寅时');
assert.equal(calcTrueSolarBranch(0, 50, 105.8, 420), 0, '00:50 河内仍是早子时');
assert.equal(calcTrueSolarBranch(1, 2, 105.8, 420), 1, '01:02 河内真太阳时约 01:05，丑时');
assert.equal(calcTrueSolarBranch(1, 2, 105.8), 0, '同一钟表若按北京经线 120° 修正，01:02 会落在子时');

function formAt(overrides: Partial<BirthFormState> = {}): BirthFormState {
  return {
    name: '',
    year: '2002',
    month: '5',
    day: '15',
    clockHour: '14',
    clockMinute: '30',
    unknownTime: false,
    province: '',
    city: '',
    longitude: 120,
    gender: 'male',
    ...overrides,
  };
}

function hanoi(clockHour: string, clockMinute: string): BirthFormState {
  return formAt({
    clockHour,
    clockMinute,
    city: 'Hà Nội',
    longitude: 105.8,
    utcOffsetMinutes: 420,
  });
}

function withoutOffset(form: BirthFormState): BirthFormState {
  const { utcOffsetMinutes: _offset, ...rest } = form;
  return rest;
}

const pick = (info: ReturnType<typeof formToBirthInfo>) => ({
  year: info.year,
  month: info.month,
  day: info.day,
  hour: info.hour,
});

const china = formAt({
  clockHour: '14',
  clockMinute: '0',
  province: '北京市',
  city: '北京',
  longitude: 116.4,
});
assert.equal(china.utcOffsetMinutes, undefined);
assert.equal(pick(formToBirthInfo(china)).hour, legacyBranch(14, 0, 116.4));
assert.deepEqual(pick(formToBirthInfo(china)), { year: 2002, month: 5, day: 15, hour: legacyBranch(14, 0, 116.4) });

const hanoiAfternoon = formToBirthInfo(hanoi('14', '30'));
assert.equal(hanoiAfternoon.hour, calcTrueSolarBranch(14, 30, 105.8, 420));
assert.equal(hanoiAfternoon.hour, branchFromClockPlus(14, 30, hanoiCorrection));
assert.deepEqual(pick(hanoiAfternoon), { year: 2002, month: 5, day: 15, hour: 7 }, '2002-05-15 14:30 河内男命仍是未时');

assert.deepEqual(
  pick(formToBirthInfo(hanoi('0', '50'))),
  { year: 2002, month: 5, day: 15, hour: 0 },
  '00:50 越南时间留在本日早子时',
);
assert.deepEqual(
  pick(formToBirthInfo(hanoi('1', '2'))),
  { year: 2002, month: 5, day: 15, hour: 1 },
  '01:02 河内是本日丑时，不换日',
);
assert.deepEqual(
  pick(formToBirthInfo(withoutOffset(hanoi('1', '2')))),
  { year: 2002, month: 5, day: 15, hour: 0 },
  '同一 01:02 若误用东经 120°，会落在子时',
);
assert.equal(formToBirthInfo(hanoi('2', '40')).hour, 1);
assert.equal(formToBirthInfo(hanoi('3', '40')).hour, 2);

const lateZiSolar = 23 * 60 + 30 + hanoiCorrection;
assert.ok(lateZiSolar > 23 * 60 + 30 && lateZiSolar < 24 * 60, '23:30 只加约 3 分钟，不多加 60 分钟');
assert.deepEqual(
  pick(formToBirthInfo(hanoi('23', '30'))),
  { year: 2002, month: 5, day: 16, hour: 0 },
  '23:30 越南时间是晚子时，排到次日',
);
assert.deepEqual(
  pick(formToBirthInfo(withoutOffset(hanoi('23', '30')))),
  { year: 2002, month: 5, day: 15, hour: 11 },
  '同一 23:30 若按北京经线修正，真太阳时约 22:33，本日亥时，不换日',
);

const chinaParams = formToSearchParams(china);
assert.equal(chinaParams.has('tz'), false, '中国链接不写时区参数');
const chinaRoundTrip = searchParamsToForm(chinaParams);
assert.equal(chinaRoundTrip?.utcOffsetMinutes, undefined);
assert.equal(chinaRoundTrip?.longitude, 116.4);
assert.equal(chinaRoundTrip?.city, '北京');

const explicitBeijing = formToSearchParams({ ...china, utcOffsetMinutes: 480 });
assert.equal(explicitBeijing.has('tz'), false, '480 视为北京时间，不写入链接');

const vietnamParams = formToSearchParams(hanoi('14', '30'));
assert.equal(vietnamParams.get('tz'), '420');
assert.equal(vietnamParams.get('c'), 'Hà Nội');
assert.equal(vietnamParams.get('lo'), '105.8');
const vietnamRoundTrip = searchParamsToForm(vietnamParams);
assert.equal(vietnamRoundTrip?.utcOffsetMinutes, 420);
assert.equal(vietnamRoundTrip?.city, 'Hà Nội');
assert.equal(vietnamRoundTrip?.longitude, 105.8);
assert.deepEqual(
  pick(formToBirthInfo({ ...hanoi('14', '30'), ...vietnamRoundTrip })),
  pick(hanoiAfternoon),
  '分享链接来回后时辰不变',
);

const oldLink = searchParamsToForm(new URLSearchParams('y=1990&m=6&d=1&h=14&mi=0&lo=116.4&p=北京市&c=北京&g=m'));
assert.ok(oldLink);
assert.equal(oldLink.utcOffsetMinutes, undefined, '没有 tz 的旧链接仍是北京时间');
assert.equal(oldLink.longitude, 116.4);
assert.equal(
  formToBirthInfo({ ...formAt(), ...oldLink, year: '1990', month: '6', day: '1' }).hour,
  legacyBranch(14, 0, 116.4),
);

const tz480 = searchParamsToForm(new URLSearchParams('y=2000&m=1&d=1&tz=480&lo=116.4'));
assert.equal(tz480?.utcOffsetMinutes, undefined);
assert.equal(tz480?.longitude, 116.4);

const vietnamWithoutLongitude = searchParamsToForm(new URLSearchParams('y=2002&m=5&d=15&tz=420&c=Hà Nội&g=m'));
assert.equal(vietnamWithoutLongitude?.utcOffsetMinutes, 420);
assert.equal(vietnamWithoutLongitude?.longitude, 105.8, '越南链接没写经度时默认河内');

const formSrc = readFileSync(new URL('../../components/BirthForm.tsx', import.meta.url), 'utf8');
assert.equal(formSrc.includes("t('选择省/市')"), true, '越南下拉使用省级占位文案');

const vi = readFileSync(new URL('../../lib/i18n/vi.ts', import.meta.url), 'utf8');
for (const key of ['出生地区', '中国', '越南', '选择城市', '选择省/市', '出生时间（越南标准时间 UTC+7）', '出生时间（北京时间）']) {
  assert.equal(vi.includes(`'${key}'`), true, `缺少文案：${key}`);
}
assert.equal(vi.includes('Khu vực sinh'), true);
assert.equal(vi.includes('Trung Quốc'), true);
assert.equal(vi.includes('Việt Nam'), true);
assert.equal(vi.includes('Giờ sinh (giờ chuẩn Việt Nam UTC+7)'), true);
assert.equal(vi.includes('Giờ sinh (giờ Bắc Kinh)'), true);
assert.equal(vi.includes('Chọn tỉnh thành'), true);

console.log('vietnam birth-time regression passed');
