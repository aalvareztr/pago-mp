import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaBuilding } from "react-icons/fa6";
import { AppContext } from '../../context/AppContext';
import { Button, Table } from 'antd';


const FacturasCliente = () => {

  const [ loading,setLoading ] = useState(false)
  const { clientData,pagos,setPagos } = useContext(AppContext);
  const [ facturas,setFacutras ] = useState([]);

  async function pay (data){
    console.log('mandando')
    try{
      const response = await axios.post('http://localhost:4000/api/create-order',data)
      console.log(response)
      console.log(response.data.data.body.init_point)
      window.open(`${response.data.data.body.init_point}`, '_blank');
    }catch(err){
      console.log(err)
    }
  }


  async function get_data(){
    setLoading(true)
    console.log('empezando la peticion')
    try{
      const response = await axios.post('https://wecomglobal.pythonanywhere.com/api/pago',{rut:'778639556'})
      console.log(response)
      const updateData = response.data.factura_y_monto_por_cliente.map((item,index)=>{
        return {key:index, id:item.factura, vencimiento: "2023-07-12", bruto:item.monto, neto:item.monto}
      })
      
      let totalResults = []
      console.log(pagos)
      updateData.forEach(element => {
        const find_element = pagos.find((pago)=> pago.idDoc === element.id)
        if(find_element){
          const factura_pagada = {...element,pagada:true}
          totalResults.push(factura_pagada)
        }else{
          const factura_no_pagada = {...element,pagada:false}
          totalResults.push(factura_no_pagada)
        }
      });
      setFacutras(totalResults)
    } catch(err){
      console.log(err)
    }finally{
      console.log('peticion terminada')
      setLoading(false)
    }
  }

  useEffect(() => {
    get_data()
  }, [])
  
  
  const columns = [{
    title: 'ID/Doc',
    dataIndex: 'id',
    key: 'id',
  }, {
    title: 'Vencimiento',
    dataIndex: 'vencimiento',
    key: 'vencimiento',
  }, {
    title: 'Bruto',
    dataIndex: 'bruto',
    key: 'bruto',
    render: (text, record) => (
      <>
        {`$${text}`}
      </>
    ),
  },{
    title: 'Neto',
    dataIndex: 'neto',
    key: 'neto',
    render: (text, record) => (
      <>
        {`$${text}`}
      </>
    ),
  },{
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
      <>
        <Button type="primary">
          Ver
        </Button>
        {
          record.pagada === false ?
          <Button style={{marginLeft:10}} type="primary" onClick={() =>{pay({ rut: clientData.rut, monto: parseFloat(record.bruto), idDoc: record.id }) }}>
            Pagar
          </Button>
          :
          <></>
        }
      </>
    ),
  },
  

  ];

  return (
    <>
      <div className='main_formularios'>
        <div className='formularios_header'>
          <div>Salir</div>
        </div>
        <div className='formularios_box_info' style={{fontWeight:300}}>
          <div style={{height:70,width:70,backgroundColor:"#e01a4f",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <FaBuilding fontSize={34} color='#f8b133'/>
          </div>
          <div className='formularios_box_info-data'>
            <div><span style={{fontWeight:700}}>Nombre razon social:</span> {clientData.razon_social}</div>
            <div><span style={{fontWeight:700}}>Rut</span> {clientData.rut} </div>
            <div><span style={{fontWeight:700}}>Correo</span> {clientData.mail}</div>
          </div>
        </div>
        <div className='formularios_box_fact'>
          <h1>Facturas pendientes de pago</h1>
          {
            loading === true ?
            <div>Cargando facturas...</div>
            :
            <Table dataSource={facturas} columns={columns} />
          }
          
        </div>
      </div>
    </>
  )
}

export default FacturasCliente

