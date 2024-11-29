'use client';
import React from 'react';

import { Navbar } from '@/app/components/navbar/navbar';
import BodyEmpresas from '@/app/components/body/bodyEmpresas';
import BodyIndices from '@/app/components/bodyIndices/bodyIndices';
import { useTranslation } from 'react-i18next';
import '../../i18n';


const Home = () => {
  const { t,i18n } = useTranslation();

  return (
    <div className="min-h-screen border bg-gray-0">
      <Navbar botonRedireccion={"Indices Bursatiles"} url={"./indiceBursatil"} />

      <div className="flex flex-col md:flex-row justify-center items-center gap-12 p-8">
        <div className="w-full md:w-1/2 bg-zinc-50 p-4 rounded-lg shadow-gray-500 shadow-lg">
          <BodyEmpresas />
        </div>
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-gray-500 shadow-lg">
          <BodyIndices />
        </div>
      </div>
    </div>
  );
}

export default Home;