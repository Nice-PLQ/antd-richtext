export interface Locale {
  locale: string;
  messages: Record<string, string>;
}

export interface LocaleProviderProps {
  locale: Locale;
}
