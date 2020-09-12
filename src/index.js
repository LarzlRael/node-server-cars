const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const multer = require('multer');
const cors = require('cors');
// rutas para usar 
const cloud_routes = require('./routes/cloudinaryRoute')
const user = require('./routes/userRoutes');
const login = require('./routes/login');

require('dotenv').config()

//? settings 

app.set('port', process.env.PORT || 5000);
app.use(cors())
app.set(morgan('dev'));
app.use(express.json())
app.use(express.urlencoded({ extended: false }));

// configuracion para poder subir a imagenes
const storage = multer.diskStorage({
    filename: (req, file, cb, filename) => {
        console.log('cloudunary sucess')
        cb(null, new Date().getTime() + path.extname(file.originalname));
    },
    destination: path.join(__dirname, ('public/uploads'))

});
// importante que en campo de texto se realizde con este campo de imagen
app.use(multer({ storage }).single('myImage'));

//? rutas para consultar el cloud
app.use(cloud_routes);

// ? rutas para los usuarios
app.use('/users', user);
app.use('/login',login);

//? public files

//? listening the server
app.listen(app.get('port'), () => {
    const port = app.get('port');
    console.log(`Server on port localhost:${port}`);
});
