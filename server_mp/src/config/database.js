import mysql from 'mysql2/promise';
import 'dotenv/config'


export const connection = await mysql.createConnection('mysql://6wf41ckml91kdz8s341m:pscale_pw_UBuALOsqU60Bexv2HpawUmy4cNSQYHuvkMgMxcDJzuf@aws.connect.psdb.cloud/miasesordb?ssl={"rejectUnauthorized":true}');



