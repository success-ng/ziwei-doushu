/**
 * Dịch bài v4.0: cache và cấu hình khóa, không gọi mạng.
 */
import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  TOPIC_KEYS,
  parseCachedTopics,
  translateDatasetTopics,
  translationConfig,
  type ChatFetch,
} from '../../lib/ziwei/translate-reading';

function zhTopics(): Record<string, string> {
  const topics: Record<string, string> = {};
  for (const key of TOPIC_KEYS) {
    topics[key] = `**【标题${key}】**\n\n这是中文解释。`;
  }
  return topics;
}

function viTopics(keys: readonly string[]): Record<string, string> {
  const topics: Record<string, string> = {};
  for (const key of keys) {
    topics[key] = `**【Mục ${key}】**\n\nĐoạn tiếng Việt cho mục ${key}.`;
  }
  return topics;
}

function cacheFile(root: string, key: string): string {
  return path.join(root, 'data', 'v4', 'cache', `${key}.vi.json`);
}

async function main() {
  assert.equal(translationConfig({}), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: '' }), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: '   ' }), null);
  assert.equal(translationConfig({ DEEPSEEK_API_KEY: 'your-deepseek-api-key' }), null);
  assert.equal(translationConfig({
    AI_PROVIDER: 'mimo',
    MIMO_API_KEY: '',
    MIMO_BASE_URL: 'https://example.test/v1',
    MIMO_MODEL: 'mimo-model',
  }), null);
  assert.equal(translationConfig({
    AI_PROVIDER: 'mimo',
    MIMO_API_KEY: 'your-api-key',
    MIMO_BASE_URL: 'https://example.test/v1',
    MIMO_MODEL: 'mimo-model',
  }), null);
  assert.equal(translationConfig({
    AI_PROVIDER: 'mimo',
    MIMO_API_KEY: 'real-key',
    MIMO_BASE_URL: '',
    MIMO_MODEL: 'mimo-model',
  }), null);

  const deepseek = translationConfig({ AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: 'sk-test' });
  assert.equal(deepseek?.baseUrl, 'https://api.deepseek.com/v1');
  assert.equal(deepseek?.model, 'deepseek-chat');
  assert.equal(deepseek?.provider, 'deepseek');

  const mimo = translationConfig({
    AI_PROVIDER: 'mimo',
    MIMO_API_KEY: 'real-key',
    MIMO_BASE_URL: 'https://example.test/v1/',
    MIMO_MODEL: 'mimo-model',
  });
  assert.equal(mimo?.baseUrl, 'https://example.test/v1');
  assert.equal(mimo?.model, 'mimo-model');
  assert.equal(mimo?.provider, 'mimo');

  assert.equal(translationConfig({ AI_PROVIDER: 'openai', OPENAI_API_KEY: '' }), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'openai', OPENAI_API_KEY: '   ' }), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'openai', OPENAI_API_KEY: 'your-api-key' }), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'openai', OPENAI_API_KEY: 'your-deepseek-api-key' }), null);
  assert.equal(translationConfig({ AI_PROVIDER: 'anthropic', OPENAI_API_KEY: 'sk-test' }), null);

  const openai = translationConfig({ AI_PROVIDER: 'openai', OPENAI_API_KEY: 'sk-test' });
  assert.equal(openai?.provider, 'openai');
  assert.equal(openai?.baseUrl, 'https://api.openai.com/v1');
  assert.equal(openai?.model, 'gpt-4o-mini');

  const openaiOverride = translationConfig({
    AI_PROVIDER: 'OpenAI',
    OPENAI_API_KEY: 'sk-test',
    OPENAI_BASE_URL: 'https://example.test/v1/',
    OPENAI_MODEL: 'gpt-4.1-mini',
  });
  assert.equal(openaiOverride?.provider, 'openai');
  assert.equal(openaiOverride?.baseUrl, 'https://example.test/v1');
  assert.equal(openaiOverride?.model, 'gpt-4.1-mini');

  const root = await mkdtemp(path.join(tmpdir(), 'zw-translate-'));
  try {
    const source = zhTopics();
    const cachedKey = '2002-01-01-0-male';
    const cached = viTopics(TOPIC_KEYS);
    const dir = path.dirname(cacheFile(root, cachedKey));
    await mkdir(dir, { recursive: true });
    await writeFile(cacheFile(root, cachedKey), JSON.stringify(cached), 'utf8');

    let calls = 0;
    const hit = await translateDatasetTopics({
      key: cachedKey,
      topics: source,
      env: {},
      root,
      fetchImpl: async () => {
        calls += 1;
        throw new Error('network');
      },
    });
    assert.equal(calls, 0);
    assert.equal(hit.translated, true);
    assert.equal(hit.reason, undefined);
    assert.equal(hit.topics.overview, cached.overview);
    assert.equal(hit.topics.parents, cached.parents);
    assert.equal(parseCachedTopics(hit.topics)?.love, cached.love);

    const partialKey = '2002-01-01-1-male';
    const partial = { ...cached };
    delete partial.parents;
    await writeFile(cacheFile(root, partialKey), JSON.stringify(partial), 'utf8');
    const missed = await translateDatasetTopics({
      key: partialKey,
      topics: source,
      env: { AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: '' },
      root,
      fetchImpl: async () => {
        calls += 1;
        throw new Error('network');
      },
    });
    assert.equal(calls, 0);
    assert.equal(missed.translated, false);
    assert.equal(missed.reason, 'no-key');
    assert.equal(missed.topics.overview, source.overview);
    assert.equal(missed.topics.parents, source.parents);

    const deniedKey = '2002-01-01-2-female';
    const denied = await translateDatasetTopics({
      key: deniedKey,
      topics: source,
      env: { AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: 'sk-test' },
      root,
      fetchImpl: async () => {
        calls += 1;
        return new Response('unauthorized', { status: 401 });
      },
    });
    assert.equal(calls, 1);
    assert.equal(denied.translated, false);
    assert.equal(denied.reason, 'translate-failed');
    assert.equal(denied.topics, source);
    await assert.rejects(readFile(cacheFile(root, deniedKey), 'utf8'));

    const chunkKey = '2002-01-01-3-male';
    const chunkFetch: ChatFetch = async (url, init) => {
      calls += 1;
      assert.equal(url, 'https://api.deepseek.com/v1/chat/completions');
      const bodyText = String(init.body);
      assert.equal(bodyText.includes('sk-test'), false);
      const req = JSON.parse(bodyText) as {
        model: string;
        temperature?: number;
        max_tokens?: number;
        messages: { role: string; content: string }[];
      };
      assert.equal(req.model, 'deepseek-chat');
      assert.equal(req.temperature, 0);
      assert.equal(req.max_tokens, 8192);
      const user = req.messages.find(message => message.role === 'user');
      const payload = JSON.parse(user?.content ?? '{}') as Record<string, string>;
      const keys = Object.keys(payload);
      if (keys.length > 4) {
        return Response.json({
          choices: [{ finish_reason: 'length', message: { content: '{' } }],
        });
      }
      return Response.json({
        choices: [{ finish_reason: 'stop', message: { content: JSON.stringify(viTopics(keys)) } }],
      });
    };
    const beforeChunk = calls;
    const chunked = await translateDatasetTopics({
      key: chunkKey,
      topics: source,
      env: { AI_PROVIDER: 'deepseek', DEEPSEEK_API_KEY: 'sk-test' },
      root,
      fetchImpl: chunkFetch,
    });
    assert.equal(chunked.translated, true);
    assert.equal(chunked.topics.career, viTopics(['career']).career);
    assert.ok(calls - beforeChunk >= 2);
    const stored = parseCachedTopics(JSON.parse(await readFile(cacheFile(root, chunkKey), 'utf8')));
    assert.equal(stored?.home, chunked.topics.home);

    const after = calls;
    const second = await translateDatasetTopics({
      key: chunkKey,
      topics: source,
      env: {},
      root,
      fetchImpl: async () => {
        calls += 1;
        throw new Error('network');
      },
    });
    assert.equal(calls, after);
    assert.equal(second.translated, true);
    assert.equal(second.topics.overview, chunked.topics.overview);

    const viAll = JSON.stringify(viTopics(TOPIC_KEYS));
    const okChat = () => Response.json({
      choices: [{ finish_reason: 'stop', message: { content: viAll } }],
    });
    const readBody = (init: RequestInit | undefined) => JSON.parse(String(init?.body ?? '{}')) as {
      model?: string;
      temperature?: number;
      max_tokens?: number;
    };

    let blankCalls = 0;
    const blank = await translateDatasetTopics({
      key: '2002-02-02-0-male',
      topics: source,
      env: {
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: '',
        OPENAI_BASE_URL: 'https://genai.example/v1',
        OPENAI_MODEL: 'v_glm46',
        OPENAI_TEMPERATURE: '0',
        OPENAI_MAX_TOKENS: '100000',
      },
      root,
      fetchImpl: async () => {
        blankCalls += 1;
        throw new Error('network');
      },
    });
    assert.equal(blankCalls, 0);
    assert.equal(blank.translated, false);
    assert.equal(blank.reason, 'no-key');
    assert.equal(blank.topics.overview, source.overview);

    const glm = await translateDatasetTopics({
      key: '2002-02-02-1-female',
      topics: source,
      env: {
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'sk-test',
        OPENAI_BASE_URL: 'https://genai.example/v1/',
        OPENAI_MODEL: 'v_glm46',
        OPENAI_TEMPERATURE: '0',
        OPENAI_MAX_TOKENS: '100000',
      },
      root,
      fetchImpl: async (url, init) => {
        calls += 1;
        assert.equal(url, 'https://genai.example/v1/chat/completions');
        const req = readBody(init);
        assert.equal(req.model, 'v_glm46');
        assert.equal(req.temperature, 0);
        assert.equal(req.max_tokens, 100000);
        return okChat();
      },
    });
    assert.equal(glm.translated, true);

    const plain = await translateDatasetTopics({
      key: '2002-02-02-2-female',
      topics: source,
      env: { AI_PROVIDER: 'openai', OPENAI_API_KEY: 'sk-test' },
      root,
      fetchImpl: async (_url, init) => {
        calls += 1;
        const req = readBody(init);
        assert.equal(req.temperature, undefined);
        assert.equal(req.max_tokens, undefined);
        assert.equal(Object.hasOwn(req, 'temperature'), false);
        assert.equal(Object.hasOwn(req, 'max_tokens'), false);
        return okChat();
      },
    });
    assert.equal(plain.translated, true);

    const deepIgnored = await translateDatasetTopics({
      key: '2002-02-02-3-male',
      topics: source,
      env: {
        AI_PROVIDER: 'deepseek',
        DEEPSEEK_API_KEY: 'sk-test',
        OPENAI_TEMPERATURE: '0.7',
        OPENAI_MAX_TOKENS: '100000',
      },
      root,
      fetchImpl: async (url, init) => {
        calls += 1;
        assert.equal(url, 'https://api.deepseek.com/v1/chat/completions');
        const req = readBody(init);
        assert.equal(req.temperature, 0);
        assert.equal(req.max_tokens, 8192);
        return okChat();
      },
    });
    assert.equal(deepIgnored.translated, true);

    const mimoIgnored = await translateDatasetTopics({
      key: '2002-02-02-4-male',
      topics: source,
      env: {
        AI_PROVIDER: 'mimo',
        MIMO_API_KEY: 'real-key',
        MIMO_BASE_URL: 'https://mimo.example/v1/',
        MIMO_MODEL: 'mimo-model',
        OPENAI_TEMPERATURE: '0',
        OPENAI_MAX_TOKENS: '100000',
      },
      root,
      fetchImpl: async (url, init) => {
        calls += 1;
        assert.equal(url, 'https://mimo.example/v1/chat/completions');
        const req = readBody(init);
        assert.equal(req.model, 'mimo-model');
        assert.equal(req.temperature, 0);
        assert.equal(req.max_tokens, 8192);
        return okChat();
      },
    });
    assert.equal(mimoIgnored.translated, true);

    let retry = 0;
    const rejected = await translateDatasetTopics({
      key: '2002-02-02-5-female',
      topics: source,
      env: {
        AI_PROVIDER: 'openai',
        OPENAI_API_KEY: 'sk-test',
        OPENAI_TEMPERATURE: ' 0 ',
        OPENAI_MAX_TOKENS: '100000',
      },
      root,
      fetchImpl: async (_url, init) => {
        calls += 1;
        retry += 1;
        const req = readBody(init);
        assert.equal(req.temperature, 0);
        if (retry === 1) {
          assert.equal(req.max_tokens, 100000);
          return new Response('max_tokens is too large', { status: 400 });
        }
        assert.equal(Object.hasOwn(req, 'max_tokens'), false);
        return okChat();
      },
    });
    assert.equal(retry, 2);
    assert.equal(rejected.translated, true);
  } finally {
    await rm(root, { recursive: true, force: true });
  }

  console.log('dataset translate regression passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
