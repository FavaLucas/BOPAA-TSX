import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };
  const t = i18n.t;

  return (
    <select 
      onChange={(e) => changeLanguage(e.target.value)} 
      className="p-3 border rounded-md bg-white-700 border-gray-500 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option>{t('idioma')}</option>
      <option value='en'>English</option>
      <option value='es'>Español</option>
    </select>
  );
};

export default LanguageSwitcher;
