import React from 'react'
import { FaCircleCheck } from "react-icons/fa6";


const ModalSucces = ({setModalCheck}) => {
  return (
    <div className='overlay'>
        <div style={{height:"60%",width:"45%",backgroundColor:"white",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            
            <h2>Factura Pagada !</h2>
            <FaCircleCheck style={{fontSize:60,color:"green"}}/>
            <button onClick={()=>{setModalCheck(false)}}>Cerrar</button>
        </div>
    </div>
  )
}

export default ModalSucces