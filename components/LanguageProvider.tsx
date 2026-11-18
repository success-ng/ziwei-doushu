'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { GLOSSARY } from '@/lib/i18n/glossary';
import { VI } from '@/lib/i18n/vi';

export type Locale = 'zh' | 'vi';

const TITLES: Record<string, string> = {
  '/': 'Lá số Tử Vi · Hệ phái Nghê Hải Hạ',
  '/chart': 'Lập lá số Tử Vi',
  '/heming': 'Hợp bàn Tử Vi',
  '/library': 'Thư viện cổ thư',
  '/knowledge': 'Kho kiến thức Tử Vi',
  '/terms': 'Điều khoản dịch vụ',
  '/privacy': 'Chính sách quyền riêng tư',
  '/preview': 'Xem trước cuốn trục Tử Vi',
};

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (zh: string) => string;
  tf: (zh: string, vars: Record<string, string | number>) => string;
  term: (name: string) => string;
};

const LanguageContext = createContext<I18nValue>({
  locale: 'vi',
  setLocale: () => {},
  t: (zh) => zh,
  tf: (zh) => zh,
  term: (name) => name,
});

function lookup(locale: Locale, zh: string): string {
  if (locale !== 'vi' || !zh) return zh;
  return VI[zh] ?? GLOSSARY[zh] ?? zh;
}

function fill(template: string, vars: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    vars[key] === undefined ? `{${key}}` : String(vars[key]),
  );
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Mặc định tiếng Việt để khớp HTML từ server. zh/vi đã lưu được áp sau mount.
  const [locale, setLocale] = useState<Locale>('vi');
  const originalTitle = useRef<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('ziwei-locale');
    if (saved === 'vi' || saved === 'zh') {
      setLocale(saved);
      return;
    }
    const attr = document.documentElement.getAttribute('data-locale');
    if (attr === 'vi' || attr === 'zh') setLocale(attr);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = locale === 'vi' ? 'vi' : 'zh-CN';
    root.setAttribute('data-locale', locale);
    const saved = localStorage.getItem('ziwei-locale');
    const savedChoice = saved === 'vi' || saved === 'zh' ? saved : null;
    // Lần render đầu vẫn là `vi` trước khi effect đọc preference. Đừng ghi đè zh đã lưu.
    if (!savedChoice || savedChoice === locale) {
      localStorage.setItem('ziwei-locale', locale);
    }

    if (originalTitle.current === null) originalTitle.current = document.title;
    if (locale === 'zh') {
      if (originalTitle.current) document.title = originalTitle.current;
      return;
    }
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const title = TITLES[path];
    if (title) document.title = title;
  }, [locale]);

  const t = useCallback((zh: string) => lookup(locale, zh), [locale]);
  const tf = useCallback(
    (zh: string, vars: Record<string, string | number>) => fill(lookup(locale, zh), vars),
    [locale],
  );
  const term = useCallback((name: string) => {
    if (locale !== 'vi' || !name) return name;
    return GLOSSARY[name] ?? VI[name] ?? name;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, tf, term }),
    [locale, t, tf, term],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useI18n() {
  return useContext(LanguageContext);
}
