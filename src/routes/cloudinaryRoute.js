const { Router } = require('express');
const router = Router();

const { body } = require('express-validator');

const { verificateToken } = require('../middlewares/jwtVerification')
const controller = require('../controllers/imageController');


//? rutas Get
router.get('/cloud', (req, res) => {
    res.send('hola desde el cloud');
});

router.get('/getcarsinfo', controller.allCars);


router.get('/getImages', (req, res) => {
    return res.json(cars)
})

router.get('/getImage/:id',controller.getOneCar)


router.get('/find/:field',controller.findEmpyCar);
router.get('/find/:field/:query',controller.findCar);


//* rutas Post 


router.post('/new-image', [
    body('price').isNumeric().withMessage('Ingresa un numero'),
    body('name_car').isLength({ min: 5 }).withMessage('Nombre muy corto'),
    body('maker').notEmpty().withMessage('Ingresa de que marca es este vehiculo'),
    body('status').notEmpty().withMessage('Ingresa el estado')
    , verificateToken], controller.insertNewCar)

//* rutas Delete

router.delete('/deleteImage/:id/:public_id', [verificateToken], controller.deleteCar)

module.exports = router;