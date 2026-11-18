'use client';

import { useTheme } from '@/components/ThemeProvider';
import { useI18n, type Locale } from '@/components/LanguageProvider';

const OPTIONS: { code: Locale; label: string }[] = [
  { code: 'zh', label: '中文' },
  { code: 'vi', label: 'VI' },
];

export default function LanguageToggle() {
  const { locale, setLocale } = useI18n();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <div
      role="group"
      aria-label={locale === 'vi' ? 'Ngôn ngữ' : '语言'}
      className="flex items-center rounded-full border overflow-hidden flex-shrink-0"
      style={{
        borderColor: isDark ? 'rgba(212,168,67,0.3)' : 'rgba(140,100,20,0.35)',
        background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,252,242,0.85)',
      }}
    >
      {OPTIONS.map((option) => {
        const active = locale === option.code;
        return (
          <button
            key={option.code}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(option.code)}
            className="px-2 py-1 text-[11px] font-medium tracking-wide"
            style={{
              background: active
                ? (isDark ? 'rgba(212,168,67,0.22)' : 'rgba(180,120,20,0.16)')
                : 'transparent',
              color: active
                ? (isDark ? '#e8d090' : '#6e4808')
                : (isDark ? 'rgba(180,200,225,0.7)' : 'rgba(90,70,40,0.55)'),
            }}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
