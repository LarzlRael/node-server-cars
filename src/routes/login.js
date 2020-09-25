const { Router } = require('express');

const router = Router();

const controller = require('../controllers/login_controller');
const controllerAdmin = require('../controllers/admin_controller');

const { verificateToken } = require('../middlewares/jwtVerification');

//? Rutas bajo el /login
router.post('/', controller.login);

router.get('/getuser', verificateToken, controller.getUser);

router.post('/loginadmin',controllerAdmin.loginAdmin)

//? rutas para google
router.post('/google', controller.google);


module.exports = router;


