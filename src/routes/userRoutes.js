const { Router } = require('express');
const router = Router();

const { body } = require('express-validator');

const controller = require('../controllers/userController');
const { verificateToken, verificaRolAdmin } = require('../middlewares/jwtVerification');

//? MIDDELWARES
const USER_ADMIN_ROLE = [verificateToken, verificaRolAdmin];

//! usar esta direccion para las siguientes consultas /users

//? rutas get
router.get('/', 
    USER_ADMIN_ROLE, controller.allUsers);

//* for enable or disable users (admin)
router.get('/updateuser/:id/:enableOrDisable',
    USER_ADMIN_ROLE,
    controller.enableOrDisableUser);

    
//? obtener usuarios
router.get('/finduser/:field/:query',
    USER_ADMIN_ROLE,
    controller.findUser);



//? rutas post
router.post('/newuser', [
    body('email').isEmail().withMessage('Email no valido'),
    body('name').isLength({ min: 5 }).withMessage('Escribe un nombre con mas de 5 caracteres'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 8 }).withMessage('Escribe una contraseña de al menos 8 caracteres'),
    body('role').not()

],

    controller.newuser);



module.exports = router;

