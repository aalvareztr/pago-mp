import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Table } from 'antd';
import { FaBuilding } from 'react-icons/fa6';
import io from 'socket.io-client';
import { AppContext } from '../../context/AppContext';
import ModalFact from '../components/ModalFact';
import ModalSucces from '../components/ModalSucces';


const FacturasCliente = () => {
  const [ modal,setModal ] = useState(false)
  const [ modalCheck,setModalCheck ] = useState(false)
  const [loading, setLoading] = useState(false);
  const { clientData, pagos, facturas, setFacturas, selectedElement, setSelectedElement } = useContext(AppContext); // Corregido: Corregir el nombre de setFacutras a setFacturas
  
  async function pay(data) {
    console.log('mandando');
    try {
      const response = await axios.post('https://backend-mp-jgj8.onrender.com/api/create-order', data);
      console.log(response);
      console.log(response.data.data.body.init_point);
      window.open(`${response.data.data.body.init_point}`, '_blank');
    } catch (err) {
      console.log(err);
    }
  }

  async function get_data() {
    setLoading(true);
    console.log('empezando la peticion');
    try {
      const response = await axios.post('https://wecomglobal.pythonanywhere.com/api/pago', { rut: '778639556' });
      console.log(response);
      const updateData = response.data.factura_y_monto_por_cliente.map((item, index) => {
        return { key: index, id: item.factura, vencimiento: item.vencimiento, bruto: item.monto, neto: item.monto };
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
      setFacturas(totalResults); // Corregido: Llamando a setFacturas en lugar de setFacutras
    } catch (err) {
      console.log(err);
    } finally {
      console.log('peticion terminada');
      setLoading(false);
    }
  }

  useEffect(() => {
    get_data();
  }, []);

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
      render: (text, record) => (
        <>
          <Button type="primary" onClick={()=>{
            console.log(record)
            setSelectedElement(record)
            setModal(true)          
          }}>Ver</Button>
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
            <></>
          )}
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
        <div className='formularios_main'>
          <aside className='formularios_aside'>
            <div style={{height:70,width:70,backgroundColor:"#e01a4f",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20}}>
              <FaBuilding fontSize={34} color='#f8b133'/>
            </div>
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Nombre razon social:</span> {clientData.razon_social}</div>  
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Rut</span> {clientData.rut} </div>
            <div style={{width:"fit-content"}}><span style={{fontWeight:700}}>Correo</span> {clientData.mail}</div>
          </aside>
          <div className='formularios_content'>
            <h1>Facturas pendientes de pago</h1>
            {
              loading === true ?
              <div>Cargando facturas...</div>
              :
              <>
                <div>Selector de facturas</div>
                <Table dataSource={facturas} columns={columns} />
              </>
            }
          </div>
        </div>
      </div>
      {
        modal === true ? 
        <ModalFact setModal={setModal}/>
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

