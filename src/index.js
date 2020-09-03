const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
// rutas para usar 
const cloud_routes = require('./routes/cloudinary_route')

// settings 
app.set('port', process.env.PORT || 3000);


// rutas para consultar el cloud
app.use(cloud_routes);

// listening the server
app.listen(app.get('port'), () => {
    const port = app.get('port');
    console.log(`Server on port localhost:${port}`)
});