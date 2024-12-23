"use client"

import { i18n } from 'next-i18next';
import React, { useEffect } from 'react'
import LanguageSwitcher from '../languageSwitcher/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

export function Navbar({ botonRedireccion }: any) {
  const { t } = useTranslation(); 

  const redireccion = botonRedireccion;
  useEffect(() => { }, [redireccion]);

  return (
    <div className="navbar bg-gray-400 text-white shadow-lg h-24 shadow-gray-800" >
      <div className="navbar-start">
        <a className='pl-2'>
          <img src="./images/TSX.svg.png" alt="TSX Logo" className="w-20 h-20" />
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <h1 className="px-5 py-2 rounded-lg text-center font-bold text-xl tracking-wide bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-lg">
          {t('navbar.title')}
        </h1>
      </div>

      <div className="navbar-end pr-4">
        <LanguageSwitcher />
      </div>
    </div>
  );
}
