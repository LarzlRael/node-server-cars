const { Router } = require('express');

const router = Router();

const controller = require('../controllers/login_controller');
const { verificateToken } = require('../middlewares/jwtVerification');

//? Rutas bajo el /login
router.post('/', controller.login);

router.get('/getuser', verificateToken, controller.getUser);


//? rutas para google
router.post('/google', controller.google);


module.exports = router;

