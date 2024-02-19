import { config } from 'dotenv';
import mysql from 'mysql2/promise';

config(); // Cargar variables de entorno desde el archivo .env

export const connection = await mysql.createConnection('mysql://4sqxia8cqfonltqwt316:pscale_pw_K47cAGWD7IFMX684idsKcv7zDI4T8aSEkujnmaSSoLr@aws.connect.psdb.cloud/miasesordb?ssl={"rejectUnauthorized":true}')


