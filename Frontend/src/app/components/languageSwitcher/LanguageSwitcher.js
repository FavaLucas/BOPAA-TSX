import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select 
      onChange={(e) => changeLanguage(e.target.value)} 
      className="p-2 border rounded-md bg-gray-700 border-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value='en'>English</option>
      <option value='es'>Español</option>
    </select>
  );
};

export default LanguageSwitcher;
