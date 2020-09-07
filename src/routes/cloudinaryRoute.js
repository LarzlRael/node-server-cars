const { Router } = require('express');
const router = Router();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
const controller = require('../controllers/imageController');

const jsonBooks = fs.readFileSync('src/cars.json', 'utf-8');

let cars = JSON.parse(jsonBooks);

//Obtener las credendciales de cloudinary
// quitar eso y ponner los process. env




// rutas Get
router.get('/cloud', (req, res) => {
    res.send('hola desde el cloud');
});

router.get('/getinfo', controller.allCars);


router.get('/getImages', (req, res) => {
    return res.json(cars)
})

//* rutas Post 


router.post('/new-image', controller.insertNewCar)

//* rutas Delete

router.delete('/deleteImage/:id/:public_id', controller.deleteCar)

module.exports = router;