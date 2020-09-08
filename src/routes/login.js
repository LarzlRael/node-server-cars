const { Router } = require('express');

const router = Router();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID_CLIENT);


const controller = require('../controllers/login_controller')

//? Rutas bajo el /login
router.post('/', controller.login);





router.post('/google', controller.google);


module.exports = router;

