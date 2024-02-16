import express from 'express';
import cors from 'cors';
import AppRoutes from './src/routes/routes.js'
import { connection } from './src/config/database.js';
import { Server } from 'engine.io';
import { createServer } from 'http';



const app = express()
const server = createServer(app);
const io = new Server(server);


const PORT = process.env.PORT || 4000

app.use(cors())
app.use(express.json())
app.use(AppRoutes)

io.on('connection', (socket) => {
    console.log('a user connected');
});

app.listen(PORT)

console.log(`server running onn port ${PORT}`)
