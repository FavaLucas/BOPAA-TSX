"use client"
import Image from "next/image";
import styles from "./page.module.css";
import { obtenerCotizaciones } from "./Services/ObtenerCotizaciones";

const obtenerValores = async () => {
  const rtaCotizaciones = await obtenerCotizaciones();
  console.log(rtaCotizaciones);
}

export default function Home() {
  return (
    <button onClick={obtenerValores}>Obtener cotizaciones</button>
  );
}
