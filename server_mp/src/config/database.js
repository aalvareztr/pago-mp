import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config(); // Cargar variables de entorno desde el archivo .env

export const connection = await mysql.createConnection('mysql://969m03n62m2jwedal9x8:pscale_pw_NOR6gMRGBirl0arCM7KBcSGpL0BWC5ci0HWgfk3DEqu@aws.connect.psdb.cloud/miasesordb?ssl={"rejectUnauthorized":true}')


