
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config()

const { getConnection } = require('../database/database');

const controller = {};

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_KEY_SECRET
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

    const newCar = {
        name_car,
        price,
        description,
        imageURL: result.url,
        public_id: result.public_id,
        year,
    }
    //Guardando en la base de datos
    try {
        const conn = await getConnection();
        await conn.query("insert into car set ? ", [newCar])

    }
    catch (error) {
        res.json({ error })

    }

    try {
        await fs.unlink(req.file.path, (err) => {
            if (err) throw err;
            console.log('successfully deleted ');

        });
        console.log('archivo elimnado pero guardado')

    } catch (error) {
        res.status(403).json({error});
    }


    return res.status(200).json({ ok: 'Nuevo Carro insertado correctamente' })


}
//? metodo para poder elimiar un carro

controller.deleteCar = async (req, res) => {

    const { id, public_id } = req.params;

    try {
        const conn = await getConnection();
        //? eliminando de la base de datos
        await conn.query("DELETE FROM car WHERE id = ? ", id)

    }
    catch (error) {
        //return res.json({ error: 'Hubo un error en la insertar' })
        res.status(500).send({error})
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