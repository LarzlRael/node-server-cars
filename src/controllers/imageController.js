
const cloudinary = require('cloudinary').v2;
const fs = require('fs');


const { getConnection } = require('../database/database');

const controller = {};

cloudinary.config({
    cloud_name: '',
    api_key: '',
    api_secret: ''
});


controller.allCars = async (req, res) => {

    try {
        const conn = await getConnection();
        //? convirtiendo a decimal
        const resultado = await conn.query("Select * from car ")

        if (resultado.length == 0) {
            return res.json({ rows: 'no hay xd' });

        }
        return res.json(resultado);


    } catch (error) {
        console.log(error)
    }
}
// ? Metodo para añadir un nuevo carro con subida de fotos
controller.insertNewCar = async (req, res) => {
    // try{
    //     const conn = await getConnection();
    //     const resultado = await conn.query("Insert into ......")
    //     return res.json({})
    // }

    const {
        name_car,
        price,
        description,
        year,
    } = req.body;

    //?    si quieres ver al info descomentar esto
    //?    console.log(req.file);

    const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'cars'
    });

    console.log(result)
    const newCar = {
        name_car,
        price,
        description,
        imageURL: result.url,
        public_id: result.public_id,
        year,
    }

    //? donde se se va grabar el archivo (luego esto va ser una base de datos)
    try {
        const conn = await getConnection();
        await conn.query("insert into car set ? ", [newCar])

    }
    catch (error) {
        //eturn res.json({ error: 'Hubo un error en la inser' })
        res.send(error)

    }


    try {
        await fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('successfully deleted ');

        });
        console.log('archivo elimnado pero guardado')

    } catch (error) {
        console.log(error)
    }


    return res.status(200).json({ ok: 'Nuevo Carro insertado correctamente' })



}

controller.deleteCar = async (req, res) => {

    const { id, public_id } = req.params;

    try {
        const conn = await getConnection();
        //? eliminando de la base de datos
        await conn.query("DELETE FROM car WHERE id = ? ", id)
        // ? Eliminando de cloudinary


    }
    catch (error) {
        //eturn res.json({ error: 'Hubo un error en la inser' })
        res.send(error)

    }

    try {
        await cloudinary.uploader.destroy('cars/' + public_id)
        return res.status(200).json({ 'deleted': true })
    } catch (error) {
        return res.status(200).json({ 'deleted': false, error })

    }
}

controller.updateCar = async (req, res) => {
    // metodo para actualizar 
    // TODO: 
}

module.exports = controller;