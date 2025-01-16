import { useLanguage, Language } from '../contexts/LanguageContext';

const languages = {
  en: 'English',
  pt: 'Português',
  es: 'Español'
};

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <select
      value={language}
      onChange={(e) => setLanguage(e.target.value as Language)}
      className="p-2 rounded-md bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700"
    >
      {Object.entries(languages).map(([code, name]) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
  );
}