const { Router } = require('express');
const router = Router();
const controller = require('../controllers/userController');
const { verificateToken } = require('../middlewares/jwtVerification');

//? usar esta direccion para las siguientes consultas /users

//? rutas get
router.get('/', verificateToken, controller.allUsers);

//? rutas post
router.post('/newuser', controller.newuser);


module.exports = router;