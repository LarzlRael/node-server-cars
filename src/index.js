const express = require('express');
const app = express();
const morgan = require('morgan');
const path = require('path');
const { allowedNodeEnvironmentFlags } = require('process');

// settings 
app.set('port',process.env.PORT || 3000);




// listening the server
app.listen(app.get('port'), () => {
    console.log(`Server on port localhost:${PORT}`)
});