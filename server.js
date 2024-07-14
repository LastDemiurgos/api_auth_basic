import express from 'express';
import bodyParser from 'body-parser';
import open from 'open';
import userRoutes from './routes/userRoutes.js';

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

        // Abrir enlace de YouTube  a nada raro quizas, pero si un clasico  
        // en recuerdo a ese dia el 2018 que nos hizo la clase de app-moviles y web jaja
        // ese momento no disponia los conocimento para crearlo, solo tarde la carrera en lograrlo
if (process.env.NODE_ENV !== 'production') {
    open('https://www.youtube.com/watch?v=oHg5SJYRHA0').then(() => {
        console.log('Enlace abierto en el navegador');
    });
}

// Importar las rutas
app.use('/api/v1/users', userRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
