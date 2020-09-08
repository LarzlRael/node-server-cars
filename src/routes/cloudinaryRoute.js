const { Router } = require('express');
const router = Router();
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

//* rutas Post 

router.post('/new-image', verificateToken, controller.insertNewCar)

//* rutas Delete

router.delete('/deleteImage/:id/:public_id', controller.deleteCar)

module.exports = router;