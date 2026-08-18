import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export const SA_LANGUAGES = [
  { code: "en", label: "English" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "af", label: "Afrikaans" },
  { code: "nso", label: "Sepedi" },
  { code: "tn", label: "Setswana" },
  { code: "st", label: "Sesotho" },
  { code: "ts", label: "Xitsonga" },
  { code: "ss", label: "siSwati" },
  { code: "ve", label: "Tshivenda" },
  { code: "nr", label: "isiNdebele" },
] as const;

export type LanguageCode = (typeof SA_LANGUAGES)[number]["code"];

const STORAGE_KEY = "awpa-language";

type Ctx = {
  language: LanguageCode;
  languageLabel: string;
  setLanguage: (code: LanguageCode) => void;
};

const LanguageContext = createContext<Ctx>({
  language: "en",
  languageLabel: "English",
  setLanguage: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as LanguageCode | null;
    if (stored && SA_LANGUAGES.some((l) => l.code === stored)) setLanguageState(stored);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      language,
      languageLabel: SA_LANGUAGES.find((l) => l.code === language)?.label ?? "English",
      setLanguage: (code) => {
        setLanguageState(code);
        window.localStorage.setItem(STORAGE_KEY, code);
      },
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
