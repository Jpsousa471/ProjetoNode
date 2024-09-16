import  express from 'express'
import { pool } from './mysql';
import { v4 as uuidv4 } from 'uuid';
import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const app = express();

app.use(express.json());

app.post('/user/sing-up', (request, response) => {
  const { name, email, password } = request.body;
  pool.getConnection((err: any, connection: any) => {
    hash(password, 10,(err, hash) => {

      if(err){
        return response.status(500).json(err)

      }

      connection.query(
        'INSERT INTO users (user_id, name, email, password) VALUES (?,?,?,?)',
        [uuidv4(), name, email, hash],
        (error: any, result: any, fildes: any) => {
          connection.release();
          if (error) {
            return response.status(400).json(error)
          }
          response.status(200).json({success: true});
        }
    )
    })
    
  })
})

app.post('/user/sing-in', (request, response) => {
  const {  email, password } = request.body;
  pool.getConnection((err: any, connection: any) => {
 
      connection.query(
        'SELECT * FROM users WHERE email= ?',
        [email],
        (error: any, results: any, fildes: any) => {
          connection.release();
          if (error) {
            return response.status(500).json({error:"Erro ao conectar com o banco de dados"})
          }

          compare(password, results[0].password, (err, result) => {
            if (err) {
              return response.status(400).json({error:"Erro na sua auntenticaçãoo!"})
            }  

            if(result){
              const token = sign({
                id: results[0].user_id,
                email: results[0].email
              }, "segredo", {expiresIn: "1d"});

              console.log(token)

              return response.status(200).json({token: token})


            }
          })

        }
    )
 
    
  })
})



app.listen(4000);