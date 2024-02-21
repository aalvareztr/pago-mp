

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { FaBuilding } from 'react-icons/fa6';
import io from 'socket.io-client';
import { AppContext } from '../../context/AppContext';
import ModalFact from '../components/ModalFact';
import ModalSucces from '../components/ModalSucces';
import logo from '../assets/mi-asesor-logo.png'
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from "react-icons/fa";
import { BiSolidMessageAltError } from "react-icons/bi";
import { BiSolidErrorCircle } from "react-icons/bi";


const FacturasCliente = () => {
  const [ modal,setModal ] = useState(false)
  const [ modalCheck,setModalCheck ] = useState(false)
  const [loading, setLoading] = useState(false);
  /////
  const [ error,setError ] = useState(false);
  ////
  const [ selectedItem,setSelectedItem ] = useState(null)

  const { clientData, pagos, facturas, setFacturas, selectedElement, setSelectedElement,setAuth } = useContext(AppContext); // Corregido: Corregir el nombre de setFacutras a setFacturas
  
  async function pay(data) {
    console.log('mandando');
    
    try {
      const response = await axios.post('https://backend-mp-jgj8.onrender.com/api/create-order', data);
      console.log(response);
      console.log(response.data.data.body.init_point);
      //window.open(`${response.data.data.body.init_point}`, '_blank');
      const isMobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent) && /Safari/i.test(navigator.userAgent);
      if (isMobileSafari) {
        // En Safari móvil, redirigir la página en lugar de abrir una nueva ventana
        window.location.href = response.data.data.body.init_point;
      } else {
        // En otros navegadores, abrir una nueva ventana
        window.open(response.data.data.body.init_point, '_blank');
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function get_data() {
    setLoading(true);
    console.log('empezando la peticion');
    /*
    setTimeout(() => {
      setError(true)
      setLoading(false)
    }, 3000);
    */
    
    try {
      //respuesta del scraping de Mage
      const response = await axios.post('https://wecomglobal.pythonanywhere.com/api/pago', { rut: clientData.rut });
      console.log('respuesta de python')
      console.log(response);

      //Update Data para transformarla
      const updateData = response.data.factura_y_monto_por_cliente.map((item, index) => {
        return { key: index, id: item.factura, vencimiento: item.vencimiento, bruto: item.monto, neto: item.monto,condicion: item.condicion_pago, detalle: item.detalle, dias_atraso: item.vencido_hace };
      });

      let totalResults = [];
      console.log(pagos);
      updateData.forEach(element => {
        const find_element = pagos.find(pago => pago.idDoc === element.id);
        if (find_element) {
          const factura_pagada = { ...element, pagada: true };
          totalResults.push(factura_pagada);
        } else {
          const factura_no_pagada = { ...element, pagada: false };
          totalResults.push(factura_no_pagada);
        }
      });
      setError(false) 
      setFacturas(totalResults);
    } catch (err) {
      console.log(err);
      setError(true)
    } finally {
      console.log('peticion terminada');
      setLoading(false);
    }
    
  }

  useEffect(() => {
    get_data();
  }, []);


  //socket
  useEffect(() => {
    const socket = io('https://backend-mp-jgj8.onrender.com/');
    socket.on('pegoRegister', data => {
      console.log('Se recibió un evento de pago registrado:', data);
      console.log('facturas', facturas);
      const updateFacturas = facturas.map(item => {
        if (item.id === data.idDocOf) {
          console.log('coincide, ingreso al if');
          console.log({ ...item, pagada: true });
          return { ...item, pagada: true };
        }
        console.log(item);
        return item;
      });
      console.log(updateFacturas);
      setModalCheck(true)
      setFacturas(updateFacturas);
    });
    return () => {
      socket.disconnect();
    };
  }, [facturas]); 
  //socket
  useEffect(() => {
    const socket = io('https://backend-mp-jgj8.onrender.com/');
    socket.on('pegoRegister', data => {
      console.log('Se recibió un evento de pago registrado:', data);
      setModalCheck(true)
    });
    return () => {
      socket.disconnect();
    };
  }, []); 

  const columns = [
    {
      title: 'ID/Doc',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Vencimiento',
      dataIndex: 'vencimiento',
      key: 'vencimiento',
      render: (text, record) => (
        <>
          <div>{text}</div> 
          <div 
            style={
              record.dias_atraso >= 30 ?
              {padding:"2px 8px", marginTop:5,backgroundColor:"green",color:"black",width:"fit-content",borderRadius: 5}
              :
              (
                record.dias_atraso < 0 ?
                {padding:"2px 8px", marginTop:5,backgroundColor:"red",color:"white",width:"fit-content",borderRadius: 5}
                :
                {padding:"2px 8px", marginTop:5,backgroundColor:"yellow",color:"black",width:"fit-content",borderRadius: 5}
              )
            }
          >
            {record.dias_atraso} dias
          </div>
          
        </>
      )
    },
    {
      title: 'Detalle',
      dataIndex: 'detalle',
      key: 'detalle',
    },
    {
      title: 'Bruto',
      dataIndex: 'bruto',
      key: 'bruto',
      render: (text, record) => <>{`$${text}`}</>,
    },
    {
      title: 'Neto',
      dataIndex: 'neto',
      key: 'neto',
      render: (text, record) => <>{`$${text}`}</>,
    },
    {
      title: 'Acciones',
      key: 'acciones',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <> 
          {
            /*
            
            <Button type="primary" onClick={()=>{
              setSelectedItem(record);
              setSelectedElement({rut: record.id});
              
              setModal(true);
            }}>Ver</Button>
            */
          }
          {record.pagada === false ? (
            <Button
              style={{ marginLeft: 10 }}
              type="primary"
              onClick={() => {
                pay({ rut: clientData.rut, monto: parseFloat(record.bruto), idDoc: record.id });
              }}
            >
              Pagar
            </Button>
          ) : (
            <><div style={{width:"fit-content", padding:"5px 10px", display:"flex",alignItems:"center",gap:7}}>
                <span>Pagada</span>
                <FaCheckCircle style={{fontSize:14,color:"green"}}/>
              </div>
            </>
          )}
        </>
      ),
    },
  ];

  const navigate = useNavigate();

  return (
    <>
      <div className='main_formularios'>
        <div className='formularios_header'>
          <div onClick={()=>{
            setAuth(false)
            navigate('/')
          }}>Salir</div>
        </div>
        <div className='formularios_main'>
          <aside className='formularios_aside'>
            <div style={{height:80,width:80,backgroundColor:"white",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <img style={{height:60}} src={logo}/>
            </div>
            
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Nombre razon social:</span> {clientData.razon_social}</div>  
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Rut</span> {clientData.rut} </div>
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Correo</span> {clientData.mail}</div>
          </aside>
          <div className='formularios_content'>
            <h1 className='formularios_content-ttl'>Facturas pendientes de pago</h1>
            {
              loading === true ?
              <div style={{height:300,width:"100%",display:"flex", alignItems:"center",justifyContent:"center"}}>
                <div className='loading_spinner' style={{height:"40px", width:"40px"}}></div>
              </div>
              :
              <>
                {
                  error === true ?
                  <div style={{width:"100%",boxSizing:"border-box",padding:30,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <BiSolidErrorCircle style={{fontSize:50,color:"#EF4040"}}/>
                    <h3>¡Ocurrió un error!</h3>
                    <button style={{padding:"7px 20px",backgroundColor:"#FFA732",border:"none",cursor:"pointer",borderRadius:30}} onClick={()=>{get_data()}}>Volver a intentar</button>
                  </div>
                  :
                  <Table dataSource={facturas} columns={columns} scroll={{ x: 1200 }}/>
                }
              </>
            }
          </div>
        </div>
      </div>
      {
        modal === true ? 
        <ModalFact setModal={setModal} data={selectedItem}/>
        :
        <></>
      }
      {
        modalCheck === true ?
        <ModalSucces setModalCheck={setModalCheck}/>
        :
        <></>
      }
    </>
  )
}

export default FacturasCliente




