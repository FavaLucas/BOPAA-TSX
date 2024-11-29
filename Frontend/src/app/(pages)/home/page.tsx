'use client';
import React from 'react';

import { Navbar } from '@/app/components/navbar/navbar';
import BodyEmpresas from '@/app/components/body/bodyEmpresas';
import BodyIndices from '@/app/components/bodyIndices/bodyIndices';


const Home = () => {


  return (
    <div className="min-h-screen border bg-gray-0">
      <Navbar botonRedireccion={"Indices Bursatiles"} url={"./indiceBursatil"} />
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 p-8">
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <BodyEmpresas />
        </div>
        <div className="w-full md:w-1/2 bg-white p-4 rounded-lg shadow-md">
          <BodyIndices />
        </div>
      </div>
    </div>
  );
}

export default Home;