import { Router } from "express";
import mercadopago from 'mercadopago';
import fs from 'fs/promises';
import path from 'path';
import { connection } from "../config/database.js";

const route = Router()


route.get('/',async(req,res)=>{
    return res
    .status(200)
    .send('index')
})

///////////////////////// LOGIN ////////////////////////////////////

route.post('/api/form',async(req,res)=>{
    const { rut,password } = req.body;
    try{
        const __dirname = path.dirname(new URL(import.meta.url).pathname);
        const filePath = path.resolve(__dirname, 'data.json');
        const data = await fs.readFile(filePath, 'utf8');
        const jsonData = JSON.parse(data);

        const findClient = jsonData.find((item)=>item.rut === rut && item.clave_si === password)
        if(findClient){
            const [pagos] = await connection.execute('SELECT * FROM pagos_marcados WHERE idCliente = ?',[rut]);
            return res
            .status(200)
            .json({ok:true,data:findClient,pagos})
        }else{
            return res
            .status(400)
            .json({ok:false,code:1,message:'ruto o contrasena incorrectos'})
        }

    }catch(err){
        console.log(err)
        return res
        .status(400)
        .json({ok:false,code:0,err})
    }

})


///////////////////////// MERCADO PAGO /////////////////////////////////

route.post('/api/create-order',async(req,res)=>{    
    const { monto, rut, idDoc } = req.body

    console.log(monto)
    console.log(rut)
    console.log(idDoc)
    const docId = idDoc.replace("/", "-");


    mercadopago.configure({
      access_token:'TEST-7751939271839112-020915-a237287cb3fb227f4c76437a200ff952-1677027160'
    })

    const result = await mercadopago.preferences.create({
      items:[
        {   
          title:'Factura',
          unit_price: monto,
          currency_id:"ARS",
          quantity:1
        }
      ],
      //back_urls: { success: 'http://localhost:5173/succesPay' },
      notification_url: `https://backend-mp-jgj8.onrender.com/webhook/${monto}/${rut}/${docId}`,
    })
    res.json({ok:true,data:result}).status(200)
})


route.post('/webhook/:monto/:rut/:idDoc',async(req,res)=>{
    console.log('evento webhook')
    const { query } = req;
    const {params} = req; 
    const topic = query.topic || query.type

    console.log({query})
    
    console.log('topic')
    console.log(topic)

    if(topic === "payment"){
        const paymentId = query.id || query['data.id']
        await registerPay(paymentId,params.rut,params.idDoc,params.monto)
    }

    return res.status(200).send("OK")
})


async function registerPay (paymentId,rut,idDoc,monto){
    const data = await mercadopago.payment.findById(paymentId);
    //console.log(data.body);
    const date = new Date()
    
    if(data.body.status === 'approved'){
      try{
        await connection.execute('INSERT INTO pagos_marcados(idCliente,idDoc,bruto,neto,fecha) VALUES (?,?,?,?,?)',[rut,idDoc,monto,monto,`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`])
        const idDocOf = idDoc.replace("-", "/")
        //Aca deberia ir el socket
        io.emit('pegoRegister', {idDocOf,status:"apro"});
      }catch(err){
        console.log(err)
      }
    }
}


route.get('/api/test',async(req,res)=>{
  try{
    setTimeout(() => {
      
    }, 3000);
  }catch(err){
    return res.status(400).json({message:err})
  }
})


export default route