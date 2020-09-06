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

cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''
});


// rutas Get
router.get('/cloud', (req, res) => {
    res.send('hola desde el cloud');
});

router.get('/getinfo', controller.allCars);


router.get('/getImages', (req, res) => {
    return res.json(cars)
})

// rutas Post 
// TODO : entrar a la fase de grabado pero son un archvio  por el momento


router.post('/new-image', async (req, res) => {
    const { name_car,
        model,
        price, description } = req.body;

    console.log(req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cars'
    });

    console.log(result)
    const newCar = {
        name_car,
        model,
        price,
        description,
        imageURL: result.url,
        public_id: result.public_id
    }
    console.log(newCar)
    // donde se se va grabar el archivo (luego esto va ser una base de datos)
    cars.push(newCar);
    const carsJson = JSON.stringify(cars);
    fs.writeFileSync('src/cars.json', carsJson, 'utf-8');

    try {
        await fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('successfully deleted ');
        });
        console.log('archivo elimnado pero guardado')

    } catch (error) {
        console.log(error)
    }





    res.send(newCar)


})

module.exports = router;