/**
 * Dịch một bài luận v4.0 sang tiếng Việt khi người dùng đang xem.
 * Chỉ chạy trên server. Khóa API không bao giờ đi ra trình duyệt.
 * Có file cache đủ 13 mục thì trả luôn, không gọi model.
 */
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { GLOSSARY } from '../i18n/glossary';
import type { DatasetTopics } from './dataset-reading';

export const TOPIC_KEYS = [
  'overview',
  'personality',
  'love',
  'career',
  'wealth',
  'health',
  'family',
  'children',
  'move',
  'friends',
  'home',
  'spirit',
  'parents',
] as const;

export type TopicKey = (typeof TOPIC_KEYS)[number];

const KEY_RE = /^\d{4}-\d{2}-\d{2}-\d{1,2}-(male|female)$/;
const PLACEHOLDER_KEYS = new Set(['your-deepseek-api-key', 'your-api-key']);
const FULL_TIMEOUT_MS = 240_000;
const CHUNK_TIMEOUT_MS = 120_000;
const MAX_OUTPUT_TOKENS = 8192;

/** Nhóm dùng khi một request cả bài quá dài. */
const FALLBACK_GROUPS: readonly (readonly TopicKey[])[] = [
  ['overview', 'personality', 'love'],
  ['career', 'wealth', 'health'],
  ['family', 'children', 'move'],
  ['friends', 'home', 'spirit', 'parents'],
];

const PALACE_FORM: Record<string, string> = {
  '命宫': 'cung Mệnh',
  '身宫': 'cung Thân',
  '兄弟宫': 'cung Huynh Đệ',
  '夫妻宫': 'cung Phu Thê',
  '子女宫': 'cung Tử Tức',
  '财帛宫': 'cung Tài Bạch',
  '疾厄宫': 'cung Tật Ách',
  '迁移宫': 'cung Thiên Di',
  '交友宫': 'cung Giao Hữu',
  '仆役宫': 'cung Nô Bộc',
  '官禄宫': 'cung Quan Lộc',
  '事业宫': 'cung Quan Lộc',
  '田宅宫': 'cung Điền Trạch',
  '福德宫': 'cung Phúc Đức',
  '父母宫': 'cung Phụ Mẫu',
};

const SIHUA_FORM: Record<string, string> = {
  '化禄': 'hóa Lộc',
  '化权': 'hóa Quyền',
  '化科': 'hóa Khoa',
  '化忌': 'hóa Kỵ',
};

const EXTRA_FORM: Record<string, string> = {
  '四化': 'tứ hóa',
  '三方四正': 'tam phương tứ chính',
  '大限': 'đại hạn',
  '流年': 'lưu niên',
  '倪海厦': 'Nghê Hải Hạ',
};

const SINGLE_CHAR_KEEP = new Set([
  '甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸',
  '子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥',
  '金', '木', '水', '火', '土',
]);

export interface TranslationProvider {
  provider: 'deepseek' | 'mimo' | 'openai';
  baseUrl: string;
  model: string;
  apiKey: string;
  /** Chỉ OpenAI, khi OPENAI_TEMPERATURE là số hữu hạn. */
  temperature?: number;
  /** Chỉ OpenAI, khi OPENAI_MAX_TOKENS là số nguyên không âm. */
  maxOutputTokens?: number;
}

export interface TranslateResult {
  topics: DatasetTopics;
  translated: boolean;
  reason?: 'no-key' | 'translate-failed';
}

export type ChatFetch = (input: string, init: RequestInit) => Promise<Response>;

export type EnvLike = Record<string, string | undefined>;

export interface TranslateArgs {
  key: string;
  topics: DatasetTopics;
  env?: EnvLike;
  root?: string;
  fetchImpl?: ChatFetch;
}

const inflight = new Map<string, Promise<TranslateResult>>();

function clean(value: string | undefined): string {
  return (value ?? '').trim();
}

function finiteNumber(value: string | undefined): number | undefined {
  const text = clean(value);
  if (text === '') return undefined;
  const n = Number(text);
  return Number.isFinite(n) ? n : undefined;
}

function nonNegativeInteger(value: string | undefined): number | undefined {
  const text = clean(value);
  if (!/^\d+$/.test(text)) return undefined;
  const n = Number(text);
  return Number.isSafeInteger(n) ? n : undefined;
}

/** Null khi không có khóa dùng được. Không đọc gì khác ngoài env được truyền vào. */
export function translationConfig(env: EnvLike = process.env): TranslationProvider | null {
  const provider = clean(env.AI_PROVIDER).toLowerCase() || 'deepseek';
  if (provider === 'mimo') {
    const apiKey = clean(env.MIMO_API_KEY);
    const baseUrl = clean(env.MIMO_BASE_URL).replace(/\/+$/, '');
    const model = clean(env.MIMO_MODEL);
    if (!apiKey || PLACEHOLDER_KEYS.has(apiKey) || !baseUrl || !model) return null;
    return { provider: 'mimo', baseUrl, model, apiKey };
  }
  if (provider === 'openai') {
    const apiKey = clean(env.OPENAI_API_KEY);
    if (!apiKey || PLACEHOLDER_KEYS.has(apiKey)) return null;
    const baseUrl = clean(env.OPENAI_BASE_URL).replace(/\/+$/, '') || 'https://api.openai.com/v1';
    const model = clean(env.OPENAI_MODEL) || 'gpt-4o-mini';
    const temperature = finiteNumber(env.OPENAI_TEMPERATURE);
    const maxOutputTokens = nonNegativeInteger(env.OPENAI_MAX_TOKENS);
    return {
      provider: 'openai',
      baseUrl,
      model,
      apiKey,
      ...(temperature !== undefined ? { temperature } : {}),
      ...(maxOutputTokens !== undefined ? { maxOutputTokens } : {}),
    };
  }
  if (provider !== 'deepseek') return null;
  const apiKey = clean(env.DEEPSEEK_API_KEY);
  if (!apiKey || PLACEHOLDER_KEYS.has(apiKey)) return null;
  return {
    provider: 'deepseek',
    baseUrl: 'https://api.deepseek.com/v1',
    model: 'deepseek-chat',
    apiKey,
  };
}

export function translationCachePath(key: string, root = process.cwd()): string {
  if (!KEY_RE.test(key)) throw new Error('bad-dataset-key');
  return path.join(root, 'data', 'v4', 'cache', `${key}.vi.json`);
}

export function parseCachedTopics(raw: unknown): DatasetTopics | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const topics: DatasetTopics = {};
  for (const key of TOPIC_KEYS) {
    const value = obj[key];
    if (typeof value !== 'string' || value.trim() === '') return null;
    topics[key] = value;
  }
  return topics;
}

export async function readTranslationCache(key: string, root = process.cwd()): Promise<DatasetTopics | null> {
  let file: string;
  try {
    file = translationCachePath(key, root);
  } catch {
    return null;
  }
  try {
    const raw = await readFile(file, 'utf8');
    return parseCachedTopics(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function writeTranslationCache(key: string, topics: DatasetTopics, root = process.cwd()): Promise<void> {
  const parsed = parseCachedTopics(topics);
  if (!parsed) throw new Error('incomplete-topics');
  const file = translationCachePath(key, root);
  await mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  try {
    await writeFile(tmp, JSON.stringify(parsed), 'utf8');
    await rename(tmp, file);
  } catch (err) {
    await rm(tmp, { force: true }).catch(() => undefined);
    throw err;
  }
}

export function translateDatasetTopics(args: TranslateArgs): Promise<TranslateResult> {
  const root = args.root ?? process.cwd();
  const id = `${root}::${args.key}`;
  const existing = inflight.get(id);
  if (existing) return existing;
  const pending = runTranslation(args).finally(() => {
    if (inflight.get(id) === pending) inflight.delete(id);
  });
  inflight.set(id, pending);
  return pending;
}

async function runTranslation(args: TranslateArgs): Promise<TranslateResult> {
  const root = args.root ?? process.cwd();
  const cached = await readTranslationCache(args.key, root);
  if (cached) return { topics: cached, translated: true };

  const config = translationConfig(args.env);
  if (!config) return { topics: args.topics, translated: false, reason: 'no-key' };

  try {
    const translated = await translateWithProvider(config, args.topics, args.fetchImpl ?? defaultFetch);
    await writeTranslationCache(args.key, translated, root);
    return { topics: translated, translated: true };
  } catch {
    return { topics: args.topics, translated: false, reason: 'translate-failed' };
  }
}

const defaultFetch: ChatFetch = (input, init) => fetch(input, init);

class TranslateError extends Error {
  readonly status: number;
  readonly detail: string;
  readonly split: boolean;
  readonly maxTokensRejected: boolean;
  readonly jsonRejected: boolean;

  constructor(status: number, detail: string, split: boolean, flags?: { maxTokensRejected?: boolean; jsonRejected?: boolean }) {
    super('translate-failed');
    this.status = status;
    this.detail = detail;
    this.split = split;
    this.maxTokensRejected = flags?.maxTokensRejected ?? false;
    this.jsonRejected = flags?.jsonRejected ?? false;
  }
}

interface Attempt {
  ok: boolean;
  split: boolean;
  topics?: DatasetTopics;
}

function systemPrompt(): string {
  const lines = [
    ...Object.entries(PALACE_FORM).map(([zh, vi]) => `${zh} = ${vi}`),
    ...Object.entries(SIHUA_FORM).map(([zh, vi]) => `${zh} = ${vi}`),
    ...Object.entries(EXTRA_FORM).map(([zh, vi]) => `${zh} = ${vi}`),
  ];
  for (const [zh, vi] of Object.entries(GLOSSARY)) {
    if (PALACE_FORM[zh] || SIHUA_FORM[zh]) continue;
    if ([...zh].length === 1 && !SINGLE_CHAR_KEEP.has(zh)) continue;
    lines.push(`${zh} = ${vi}`);
  }

  return [
    'Bạn dịch luận giải Tử Vi Đẩu Số từ tiếng Trung sang tiếng Việt tự nhiên.',
    'Người dùng gửi một JSON. Mỗi khóa là một mục, mỗi giá trị là markdown tiếng Trung.',
    'Chỉ trả về một JSON object với đúng các khóa đó. Giá trị là bản dịch. Không bọc ```.',
    'Không tóm tắt, không bỏ đoạn, không thêm lời dẫn.',
    'Mỗi tiêu đề dạng **【...】** phải đứng một dòng riêng, đúng dạng **【tiêu đề tiếng Việt】**. Giữ dấu sao và ngoặc 【】.',
    'Dịch lời giải thích. Tên sao, tên cung và tứ hóa phải dùng đúng cách gọi trong bảng, không để chữ Hán, không dịch nghĩa.',
    'Ví dụ: 紫微 = Tử Vi, 天府 = Thiên Phủ, 命宫 = cung Mệnh, 化禄 = hóa Lộc, 化权 = hóa Quyền, 化科 = hóa Khoa, 化忌 = hóa Kỵ.',
    'Giữ **in đậm** nếu bản gốc có. Không đổi các khóa JSON.',
    '',
    'Bảng thuật ngữ:',
    lines.join('\n'),
  ].join('\n');
}

function subset(topics: DatasetTopics, keys: readonly TopicKey[]): DatasetTopics {
  const out: DatasetTopics = {};
  for (const key of keys) out[key] = topics[key] ?? '';
  return out;
}

function looksVietnamese(text: string): boolean {
  const letters = text.match(/[A-Za-zÀ-ỹ]/g);
  return (letters?.length ?? 0) >= 20;
}

function keepsHeadings(source: string, translated: string): boolean {
  const expected = source.match(/\*\*【[^】]*】\*\*/g)?.length ?? 0;
  if (expected === 0) return true;
  const actual = translated.match(/\*\*【[^】]*】\*\*/g)?.length ?? 0;
  return actual >= expected;
}

function parseModelJson(content: string): unknown {
  let text = content.trim();
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) text = fenced[1].trim();
  try {
    return JSON.parse(text);
  } catch {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');
    if (start === -1 || end <= start) return null;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch {
      return null;
    }
  }
}

function extractTopics(raw: unknown, keys: readonly TopicKey[]): DatasetTopics | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
  const obj = raw as Record<string, unknown>;
  const direct = takeTopics(obj, keys);
  if (direct) return direct;
  for (const value of Object.values(obj)) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) continue;
    const nested = takeTopics(value as Record<string, unknown>, keys);
    if (nested) return nested;
  }
  return null;
}

function takeTopics(obj: Record<string, unknown>, keys: readonly TopicKey[]): DatasetTopics | null {
  const topics: DatasetTopics = {};
  for (const key of keys) {
    const value = obj[key];
    if (typeof value !== 'string' || value.trim() === '') return null;
    topics[key] = value;
  }
  return topics;
}

function validateTranslation(source: DatasetTopics, content: string, keys: readonly TopicKey[]): DatasetTopics | null {
  const parsed = parseModelJson(content);
  const picked = extractTopics(parsed, keys);
  if (!picked) return null;
  for (const key of keys) {
    const value = picked[key];
    if (!looksVietnamese(value) || !keepsHeadings(source[key] ?? '', value)) return null;
  }
  return picked;
}

function looksOversized(status: number, detail: string): boolean {
  if (status === 413) return true;
  if (status !== 400) return false;
  if (looksMaxTokensRejected(status, detail)) return false;
  return /context|token|too long|too large|payload|string_above_max|exceed|maximum/i.test(detail);
}

function looksMaxTokensRejected(status: number, detail: string): boolean {
  if (status !== 400) return false;
  return /max_tokens/i.test(detail) && /invalid|range|maximum|at most|less than|unsupported|too large/i.test(detail);
}

function looksJsonModeRejected(status: number, detail: string): boolean {
  if (status !== 400) return false;
  return /response_format|json_object/i.test(detail);
}

function isTimeout(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const name = (err as { name?: string }).name;
  return name === 'TimeoutError' || name === 'AbortError';
}

async function postChat(
  config: TranslationProvider,
  keys: readonly TopicKey[],
  topics: DatasetTopics,
  fetchImpl: ChatFetch,
  timeoutMs: number,
  jsonMode: boolean,
  maxTokens: boolean,
): Promise<{ content: string; finish: string | null }> {
  const body: Record<string, unknown> = {
    model: config.model,
    stream: false,
    messages: [
      { role: 'system', content: systemPrompt() },
      { role: 'user', content: JSON.stringify(subset(topics, keys)) },
    ],
  };
  // OpenAI: chỉ gửi hai trường này khi env đặt. DeepSeek/Mimo giữ body cũ.
  if (config.provider === 'openai') {
    if (config.temperature !== undefined) body.temperature = config.temperature;
    if (maxTokens && config.maxOutputTokens !== undefined) body.max_tokens = config.maxOutputTokens;
  } else {
    body.temperature = 0;
    if (maxTokens) body.max_tokens = MAX_OUTPUT_TOKENS;
  }
  if (jsonMode) body.response_format = { type: 'json_object' };

  const controller = new AbortController();
  const timer = setTimeout(() => {
    controller.abort(new DOMException('timeout', 'TimeoutError'));
  }, timeoutMs);
  timer.unref?.();

  let res: Response;
  try {
    res = await fetchImpl(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
  } catch (err) {
    if (isTimeout(err)) throw new TranslateError(0, 'timeout', true);
    throw new TranslateError(0, 'network', false);
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const detail = (await res.text().catch(() => '')).slice(0, 500);
    throw new TranslateError(res.status, detail, looksOversized(res.status, detail), {
      maxTokensRejected: looksMaxTokensRejected(res.status, detail),
      jsonRejected: looksJsonModeRejected(res.status, detail),
    });
  }

  const data = await res.json().catch(() => null) as {
    choices?: { message?: { content?: unknown }; finish_reason?: string | null }[];
  } | null;
  const content = data?.choices?.[0]?.message?.content;
  const finish = data?.choices?.[0]?.finish_reason ?? null;
  if (typeof content !== 'string' || content.trim() === '') {
    throw new TranslateError(res.status, 'empty-content', false);
  }
  return { content, finish };
}

async function translateWithProvider(
  config: TranslationProvider,
  topics: DatasetTopics,
  fetchImpl: ChatFetch,
): Promise<DatasetTopics> {
  const opts = { jsonMode: true, maxTokens: true };

  const attempt = async (keys: readonly TopicKey[]): Promise<Attempt> => {
    const timeoutMs = keys.length === TOPIC_KEYS.length ? FULL_TIMEOUT_MS : CHUNK_TIMEOUT_MS;
    try {
      const { content, finish } = await postChat(
        config,
        keys,
        topics,
        fetchImpl,
        timeoutMs,
        opts.jsonMode,
        opts.maxTokens,
      );
      if (finish === 'length' || finish === 'max_tokens') return { ok: false, split: true };
      const translated = validateTranslation(topics, content, keys);
      if (translated) return { ok: true, split: false, topics: translated };
      return { ok: false, split: keys.length > 1 };
    } catch (err) {
      if (err instanceof TranslateError && err.maxTokensRejected && opts.maxTokens) {
        opts.maxTokens = false;
        return attempt(keys);
      }
      if (err instanceof TranslateError && err.jsonRejected && opts.jsonMode) {
        opts.jsonMode = false;
        return attempt(keys);
      }
      if (err instanceof TranslateError && err.split) return { ok: false, split: true };
      return { ok: false, split: false };
    }
  };

  const translateGroup = async (keys: readonly TopicKey[]): Promise<DatasetTopics> => {
    const result = await attempt(keys);
    if (result.ok && result.topics) return result.topics;
    if (!result.split || keys.length <= 1) throw new Error('translate-failed');
    const mid = Math.ceil(keys.length / 2);
    const left = await translateGroup(keys.slice(0, mid));
    const right = await translateGroup(keys.slice(mid));
    return { ...left, ...right };
  };

  const whole = await attempt(TOPIC_KEYS);
  if (whole.ok && whole.topics) return whole.topics;
  if (!whole.split) throw new Error('translate-failed');

  const merged: DatasetTopics = {};
  for (const group of FALLBACK_GROUPS) {
    Object.assign(merged, await translateGroup(group));
  }
  const complete = parseCachedTopics(merged);
  if (!complete) throw new Error('translate-failed');
  return complete;
}
