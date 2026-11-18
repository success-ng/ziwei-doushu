'use client';

import { useI18n } from '@/components/LanguageProvider';

/** Dịch một chuỗi tiếng Trung cố định. Dùng được trong server component. */
export function Tx({ children }: { children: string }) {
  const { t } = useI18n();
  return <>{t(children)}</>;
}

/** Dịch mẫu có biến, ví dụ "{n} 章节". */
export function Txf({
  text,
  vars,
}: {
  text: string;
  vars: Record<string, string | number>;
}) {
  const { tf } = useI18n();
  return <>{tf(text, vars)}</>;
}

/** Dịch tên sao, cung, can chi do engine trả về. */
export function Term({ name }: { name: string }) {
  const { term } = useI18n();
  return <>{term(name)}</>;
}
