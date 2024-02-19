import { Table } from 'antd'
import React from 'react'

const ModalFact = ({setModal,data}) => {
  
  return (
    <div className='overlay'>
        <div className='modal'>
          <button className='modal_btn' onClick={()=>{setModal(false)}}>Cerrar</button>
          <h2>Factura exenta</h2>
          <div className='modal_detail_header'>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <span>Facturar a</span>
              <span>Nombre cliente</span>
              <span>Rut</span>
              <span>Direccion</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:7}}>
              <span># Documento: 12007</span>
              <span>Fecha: 15/02/2024</span>
              <span>Vencimiento: 16/02/2024</span>
              <span>C. de pago: Contado contra entrega</span>
              <span>Vendedor: Gonzalo Artero</span>
              <span>Centro de beneficio: Ventas</span>
              <span>Bodega: Default</span>
            </div>
          </div>
          <table style={{width:"100%",textAlign:"start"}}>
            <thead>
              <tr>
                <th style={{textAlign:"start",backgroundColor:"pink",padding:"7px"}}>Producto / Servicio</th>
                <th style={{textAlign:"start",backgroundColor:"pink",padding:"7px"}}>Cantidad</th>
                <th style={{textAlign:"start",backgroundColor:"pink",padding:"7px"}}>Precio unitario</th>
                <th style={{textAlign:"start",backgroundColor:"pink",padding:"7px"}}>Neto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding:"7px"}}>Producto</td>
                <td style={{padding:"7px"}}>1</td>
                <td style={{padding:"7px"}}>12</td>
                <td style={{padding:"7px"}}>12</td>
              </tr>
            </tbody>
          </table>
          <div style={{display:"flex",flexDirection:"column",gap:7,textAlign:"end",marginTop:12,fontWeight:500}}>
            <span>Subtotal: $73.000</span>
            <span>Total: $73.000</span>
          </div>
        </div>
    </div>
  )
}

export default ModalFact