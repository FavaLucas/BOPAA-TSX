import React, { useEffect } from 'react'

export function Navbar({ botonRedireccion, url } : any) {

  const redireccion = botonRedireccion;
  useEffect(() => {

  }, [redireccion])


  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li><a>AMAZON</a></li>
            <li>
              <a>Parent</a>
              <ul className="p-2">
                <li><a>Cotizacion diaria</a></li>
                <li><a>Cotizacion mensual</a></li>
              </ul>
            </li>
            <li><a>GOOGLE</a></li>
          </ul>
        </div>
        <a className="btn btn-ghost text-xl"><img src="./images/TSX.svg.png" alt="" className="w-12 h-12" /></a>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li><a>APPLE</a></li>
          <li>
            <details>
              <summary>COTIZACION ACTUAL</summary>
              <ul className="p-2">
                <li><a>Cotizacion diaria</a></li>
                <li><a>Cotirzacion mensual</a></li>
              </ul>
            </details>
          </li>
          <li><a>VISA</a></li>
        </ul>
      </div>
      <div className="navbar-end">
        <a className="btn" href={url}>{redireccion}</a>
      </div>
    </div>
  )
}


