"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { obtenerCotizaciones, obtenerEmpresas, obtenerIndices } from "./Services/ObtenerDatos";
import PieChart from "./graficos/graficoTorta";
import CandlestickChart from "./graficos/graficoVelas"




const auxObtenerCotizaciones = async () => {
  const rtaCotizaciones = await obtenerCotizaciones();
  console.log(rtaCotizaciones);
}

const auxObtenerIndices = async () => {
  const rtaIndices = await obtenerIndices();
  console.log(rtaIndices);
}

const auxObtenerEmpresas = async () => {
  const rtaEmpresas = await obtenerEmpresas();
  console.log(rtaEmpresas);
}


export default function Home() {
  return (
<>
    <h1>Indice TSX - Toronto Stock Exchange </h1>
    <button onClick={auxObtenerCotizaciones}>Obtener cotizaciones</button>
    <button onClick={auxObtenerIndices}>Obtener indices</button>
    <button onClick={auxObtenerEmpresas}>Obtener empresas</button>

    <PieChart/>
    <CandlestickChart/>

</>


  );
}
