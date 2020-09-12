const { Router } = require('express');
const router = Router();

const { body, validationResult } = require('express-validator');

const controller = require('../controllers/userController');
const { verificateToken } = require('../middlewares/jwtVerification');

//? usar esta direccion para las siguientes consultas /users

//? rutas get
router.get('/', [verificateToken], controller.allUsers);

//? rutas post
router.post('/newuser', [
    body('email').isEmail().withMessage('Email no valido'),
    body('name').isLength({ min: 5 }).withMessage('Escribe un nombre con mas de 5 caracteres'),
    // password must be at least 5 chars long
    body('password').isLength({ min: 8 }).withMessage('Escribe una contraseña de al menos 8 caracteres')

],

    controller.newuser);


module.exports = router;