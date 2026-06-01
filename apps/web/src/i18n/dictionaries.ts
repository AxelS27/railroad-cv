import type { Locale } from './config';
import en from './locales/en.json';

const dictionaries = {
  en: async () => en,
} satisfies Record<Locale, () => Promise<typeof en>>;

export type Dictionary = Awaited<ReturnType<(typeof dictionaries)['en']>>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}
