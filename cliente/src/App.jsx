import { useContext, useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Formulario from './screens/Formulario'
import AppRoutes from './routes/AppRoutes'
import { AppContext } from '../context/AppContext'
import { Navigate, Route, Routes } from 'react-router-dom'
import FacturasCliente from './screens/FacturasCliente'
import FacturaView from './screens/FacturaView'
import io from 'socket.io-client'

const socket = io("http://localhost:4000")

function App() {

  const { setAuth,auth } = useContext(AppContext);  

  return (
    <>
      <main className='main'>
        {
          
          auth === false ?
          <Routes>
            <Route path='/' element={<Formulario/>} />
            <Route path='/*' element={<Navigate to='/'/>} />
          </Routes>
          :
          <Routes>
            <Route path='/profile' element={<FacturasCliente/>}/>
            <Route path='/facturacion/vista/:id' element={<FacturaView/>}/>
            <Route path='/*' element={<Navigate to='/profile'/>}/>
          </Routes>
        
        }
      </main>
    </>
  )
}

export default App
