"use client"

import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-gray-800 text-black py-6 ">
      <div className="container min-w-[1600px] px-4 w-2/3">
        <div className="flex flex-wrap justify-between items-center">
          {/* Sección del logo */}
          <div className="flex items-center mb-4 md:mb-0">
            {/* <img
              src="./images/TSX.svg.png" // Cambia a la ruta de tu logo
              alt="TSX Logo"
              className="w-16 h-auto"
            /> */}
            {/* <span className="ml-8 text-lg font-bold">{t("navbar.title")}</span> */}
          </div>

        </div>

        {/* Logos de empresas */}
        <div className="flex flex-wrap justify-center items-center gap-4 mt-3 ">
          {[
            "./images/visa.png",
            "./images/cocacola.png",
            "./images/toyota.png",
            "./images/exxonmobile.png",
            "./images/pepsico.png",
            "./images/nvidia.png",
            "./images/shell.png",
          ].map((logo, index) => (
            <img
              key={index}
              src={logo} // Ruta del logo de cada empresa
              alt={`Company ${index + 1}`}
              className="w-16 h-auto"
            />
          ))}
        </div>

        {/* Información adicional */}
        <div className="mt-6 text-center">
          <p className="text-sm">{t("footer.countries")}</p>
          <p className="text-xs mt-1">
            {t("footer.languages")} | © {new Date().getFullYear()} TSX.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
