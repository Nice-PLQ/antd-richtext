import { useMemo, createContext } from 'react';
import { Locale, LocaleProviderProps } from './type';
import defaultLocale from './locale/zh_CN';

export const LocaleContext = createContext<Locale | undefined>(undefined);

const LocaleProvider: React.FC<LocaleProviderProps> = (props) => {
  const { locale, children } = props;

  const memoLocale = useMemo<Locale>(() => locale || defaultLocale, [locale]);

  return (
    <LocaleContext.Provider value={memoLocale}>
      {children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
