import React, { useContext, useState } from 'react'
import logo from '../assets/mi-asesor-logo.png'
import LoadingScreen from './LoadingScreen'
import { AppContext } from '../../context/AppContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BsKeyFill } from "react-icons/bs";


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
      const rut = data.rut.replace("-","")
      const response = await axios.post('https://backend-mp-jgj8.onrender.com/api/form',{rut:rut,password:""})
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
            <input onChange={(e)=>{setData({...data,rut:e.target.value})}} className='formulario-input' type='text' placeholder='Ingrese su RUT'/>
            <button style={{backgroundColor:"#e01a4f",border:"none",cursor:"pointer",padding:"6px 0px",color:"white",fontWeight:600,borderRadius:7,display:"flex",alignItems:"center",justifyContent:"center", gap:6}} className='formulario-boton' type='submit'>
              <BsKeyFill style={{fontSize:30, color:"white"}}/>
              <span>INGRESAR</span>
            </button>
            
          </form>
        </div>
      }
    </>
  )
}

export default Formulario