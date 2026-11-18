import type { BirthFormState } from '@/components/BirthForm';
import { VIETNAM_DEFAULT_LONGITUDE, VIETNAM_UTC_OFFSET_MINUTES } from './cities';
import type { BirthInfo } from './types';
import { branchFromSolarMinutes, resolveZiweiDayOffset, shiftGregorianDate } from './true-solar-time';

/** 钟表时间所在时区的中央经线。不传 utcOffsetMinutes = 北京时间 480 分钟 → 东经 120°。 */
export function solarMeridian(utcOffsetMinutes?: number): number {
  return (utcOffsetMinutes ?? 480) / 4;
}

/** 根据钟表时间 + 经度计算真太阳时时辰支 (0-11)。
 *  经度修正 =（经度 − 中央经线）× 4。中国不传偏移，中央经线仍是 120，不走均时差。
 */
export function calcTrueSolarBranch(
  clockHour: number,
  clockMinute: number,
  longitude: number,
  utcOffsetMinutes?: number,
): number {
  const clockMins = clockHour * 60 + clockMinute;
  const offset = (longitude - solarMeridian(utcOffsetMinutes)) * 4;
  const solar = ((clockMins + offset) % 1440 + 1440) % 1440;
  if (solar >= 1380 || solar < 60) return 0;
  return Math.floor((solar - 60) / 120) + 1;
}

/** BirthFormState → BirthInfo
 *
 * 子时规则（倪海厦体系/三合派标准）：
 * · 23:00-23:59 = 晚子时，**按次日**排盘（日期 +1）
 * · 00:00-00:59 = 早子时，按本日排盘
 * 这与「时辰支同为子(0)」并不冲突——子时分早晚两段，需要在日期上区分。
 */
export function formToBirthInfo(form: BirthFormState): BirthInfo {
  let y = parseInt(form.year) || 0;
  let m = parseInt(form.month) || 0;
  let d = parseInt(form.day) || 0;
  let hour = 0;

  // 晚子时换日按真太阳时判定，与时辰支同一口径（见 true-solar-time.ts 的 resolveZiweiDayOffset）。
  // 只看钟表 23 点会和经度校正后的时辰错位：东经 100° 钟表 23:30 是真太阳时 22:10 亥时，不该换日。
  // 中央经线随钟表时区变：不传偏移仍是 120°。只替换经线，不改用均时差。
  if (!form.unknownTime) {
    const meridian = solarMeridian(form.utcOffsetMinutes);
    const solar = (parseInt(form.clockHour) || 0) * 60 + (parseInt(form.clockMinute) || 0) + (form.longitude - meridian) * 4;
    const normalizedMinutes = ((solar % 1440) + 1440) % 1440;
    hour = branchFromSolarMinutes(normalizedMinutes);
    const dayOffset = resolveZiweiDayOffset({ dayOffset: Math.floor(solar / 1440), normalizedMinutes, branch: hour });
    if (dayOffset !== 0 && y > 0 && m > 0 && d > 0) {
      ({ year: y, month: m, day: d } = shiftGregorianDate({ year: y, month: m, day: d }, dayOffset));
    }
  }

  return {
    year: y, month: m, day: d,
    hour,
    gender: form.gender,
    name: form.name || undefined,
    province: form.province || undefined,
    city: form.city || undefined,
    longitude: form.province || form.city ? form.longitude : undefined,
  };
}

/** BirthFormState → URLSearchParams（用于分享链接） */
export function formToSearchParams(form: BirthFormState): URLSearchParams {
  const p = new URLSearchParams();
  if (form.name) p.set('n', form.name);
  p.set('y', form.year);
  p.set('m', form.month);
  p.set('d', form.day);
  if (form.unknownTime) {
    p.set('u', '1');
  } else {
    p.set('h', form.clockHour);
    p.set('mi', form.clockMinute);
  }
  if (form.province) p.set('p', form.province);
  if (form.city) p.set('c', form.city);
  if (form.longitude && form.longitude !== 120) p.set('lo', String(form.longitude));
  // 只有非北京时区才写入。老链接没有 tz，读回来仍是中国 / 北京时间。
  if (form.utcOffsetMinutes != null && form.utcOffsetMinutes !== 480) {
    p.set('tz', String(form.utcOffsetMinutes));
  }
  p.set('g', form.gender === 'male' ? 'm' : 'f');
  return p;
}

/** URLSearchParams → Partial<BirthFormState>，不完整时返回 null */
export function searchParamsToForm(params: URLSearchParams): Partial<BirthFormState> | null {
  const year = params.get('y');
  const month = params.get('m');
  const day = params.get('d');
  if (!year || !month || !day) return null;
  const utcOffset = readUtcOffset(params);
  const loRaw = params.get('lo');
  const longitude = loRaw != null && loRaw !== ''
    ? parseFloat(loRaw)
    : (utcOffset.utcOffsetMinutes === VIETNAM_UTC_OFFSET_MINUTES ? VIETNAM_DEFAULT_LONGITUDE : 120);
  return {
    name: params.get('n') || '',
    year,
    month,
    day,
    unknownTime: params.get('u') === '1',
    clockHour: params.get('h') || '8',
    clockMinute: params.get('mi') || '0',
    province: params.get('p') || '',
    city: params.get('c') || '',
    longitude,
    gender: params.get('g') === 'f' ? 'female' : 'male',
    ...utcOffset,
  };
}

/** tz 只在分享链接里表示非北京的钟表时区（分钟）。缺省或 480 都不写回表单。 */
function readUtcOffset(params: URLSearchParams): { utcOffsetMinutes?: number } {
  const raw = params.get('tz');
  if (raw == null || raw === '') return {};
  const offset = Number(raw);
  if (!Number.isFinite(offset) || offset === 480) return {};
  return { utcOffsetMinutes: offset };
}
