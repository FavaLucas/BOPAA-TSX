import React, { useEffect } from 'react'

export function Navbar({ botonRedireccion, url }: any) {

  const redireccion = botonRedireccion;
  useEffect(() => {

  }, [redireccion])


  return (
    <div className="navbar bg-gray-600 text-white shadow-lg">
      {/* Navbar Start */}
      <div className="navbar-start">
        <a className="btn btn-ghost">
          <img src="./images/TSX.svg.png" alt="TSX Logo" className="w-12 h-12" />
        </a>
      </div>
  
      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <h1 className="px-5 py-2 rounded-lg text-center font-bold text-xl tracking-wide bg-gradient-to-r from-blue-500 to-blue-700 text-white">
          TORONTO STOCK EXCHANGE
        </h1>
      </div>
  
      {/* Navbar End */}
      <div className="navbar-end">
        {/* <a
          className="btn btn-primary px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition duration-200"
          href="#"
        >
          Login
        </a> */}
      </div>
    </div>
  );
  
}


