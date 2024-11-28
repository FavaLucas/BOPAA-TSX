'use client';
import React from 'react';


import { Navbar } from '@/app/components/navbar/navbar';
import Body from '@/app/components/body/body';



const Home = () => {


  return (
    <div>
      <Navbar botonRedireccion={"Indices Bursatiles"} url={"./indiceBursatil"}/>
      <Body />
    </div>
  );
}

export default Home;