import React, { useContext, useState } from 'react'
import logo from '../assets/mi-asesor-logo.png'
import LoadingScreen from './LoadingScreen'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
const Formulario = () => {

  const {setAuth,clientData,setClientData,pagos,setPagos} = useContext(AppContext);

  const [ data,setData ] = useState({rut:"",password:""})
  
  const [ loading,setLoading ] = useState(false)

  const navigate = useNavigate()

  const HanldeSubmit = (e) =>{
    e.preventDefault()
    get_data()
  }


  async function get_data(){
    setLoading(true)
    try{
      const response = await axios.post('https://backend-mp-jgj8.onrender.com/api/form',data)
      console.log('resouesta de render')
      console.log(response)
      console.log(response.data.data[0])
      setClientData(response.data.data[0])
      setPagos(response.data.pagos)
      setAuth(true)
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false)
    }
  }
  
  return (
    <>
      {
        loading === true ?
        <LoadingScreen/>
        :
        <div className='formulario-container'>
          <img style={{height:"200px",objectFit:"cover"}} src={logo}/>
          <form className='formulario-form' onSubmit={HanldeSubmit}>
            <input onChange={(e)=>{setData({...data,rut:e.target.value})}} className='formulario-input' type='text' placeholder='rut'/>
            <input onChange={(e)=>{setData({...data,password:e.target.value})}} className='formulario-input' type='password' placeholder='contraseña'/>
            <button style={{backgroundColor:"#e01a4f",border:"none",cursor:"pointer",padding:"14px 0px",color:"white",fontWeight:600,borderRadius:7}} className='formulario-boton' type='submit'>Enviar</button>
          </form>
        </div>
      }
    </>
  )
}

export default Formulario