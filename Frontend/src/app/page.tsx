"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { obtenerCotizaciones, obtenerEmpresas, obtenerIndices } from "./Services/ObtenerDatos";

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
    <button onClick={auxObtenerCotizaciones}>Obtener cotizaciones</button>
    <button onClick={auxObtenerIndices}>Obtener indices</button>
    <button onClick={auxObtenerEmpresas}>Obtener empresas</button>
</>


  );
}
