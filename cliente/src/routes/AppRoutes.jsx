import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Formulario from '../screens/Formulario'
import FacturasCliente from '../screens/FacturasCliente'

const AppRoutes = () => {
  const [ auth, setAuth ] = useState(false)
  return (
    <>
    {
      auth === false ?
      <Routes>
        <Route path='/' element={<Formulario/>}/>
        <Route path='/*' element={<Navigate to='/'/>} />
      </Routes>
      :
      <Routes>
        <Route path='/' element={<div>Siguiente seccion</div>} />
        <Route path='/facturas/:clientId' element={<FacturasCliente/>} />      
      </Routes>
    }
    </>
  )
}

export default AppRoutes