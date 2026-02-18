import express from 'express';
import cors from 'cors';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express'
import { pool } from './config/db.js';


import departamendoRouter from './routers/departamento.router.js';
import personaRouter from './routers/persona.router.js';
import productoRouter from './routers/producto.router.js';
import productoEntregadoRouter from './routers/persona_entrega.router.js';
import catalogoRouter from './routers/catalogo.router.js'

const app = express();
const port = process.env.PORT || 4000;

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API para la gestion de almacenamiento ',
      version: '1.0.0',
      description: 'API para el control de entrega para productos'
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Server Local'
      }
    ],
  },
  apis: ['./src/routers/*.js'],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

//Middlewares
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
  res.send('Funcionando el servidor ');
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//Rutas de la API
app.use('/api/departamento', departamendoRouter);
app.use('/api/persona', personaRouter);
app.use('/api/producto', productoRouter);
app.use('/api/producto-entregado', productoEntregadoRouter);
app.use('/api/catalogo', catalogoRouter);

const init = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Existe conexion a la base de datos');

    app.listen(port, () => {
      console.log(`Servidor corriendo en http://localhost:${port}`);
      console.log(`Swagger en http://localhost:${port}/api-docs`);
    })
  } catch (error) {
    console.error('No se pudo inciar el servidor', error.message);
    process.exit(1);
  }
}
init();


//http://localhost:4000/api/catalogo?valor=A3
