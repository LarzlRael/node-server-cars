const { Router } = require('express');
const router = Router();
const controller = require('../controllers/userController')

//? usar esta direccion para las siguientes consultas /users

//? rutas get
router.get('/', controller.allUsers);

//? rutas post
router.post('/newuser', controller.newuser);


module.exports = router;