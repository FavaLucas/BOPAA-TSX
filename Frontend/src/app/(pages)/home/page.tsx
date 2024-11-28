'use client';
import React from 'react';


import { Navbar } from '@/app/components/navbar/navbar';
import BodyEmpresas from '@/app/components/body/bodyEmpresas';



const Home = () => {


  return (
    <div>
      <Navbar botonRedireccion={"Indices Bursatiles"} url={"./indiceBursatil"}/>
      <BodyEmpresas />
    </div>
  );
}

export default Home;