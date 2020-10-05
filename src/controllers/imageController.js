
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
require('dotenv').config()
const { validationResult } = require('express-validator');

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
            return res.json({ cars: [], rows: 'No hay registros' });

        }
        return res.json({ cars: resultado,rows:'Hay registros' });

    } catch (error) {
        console.log(error)
    }
}
// ? Metodo para añadir un nuevo carro con subida de fotos
controller.insertNewCar = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        name_car,
        price,
        description,
        model,
        status,
        maker
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
        model,
        status,
        maker
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
        res.status(403).json({ error });
    }


    return res.status(200).json({ ok: 'Nuevo Carro insertado correctamente' })
}

//? funcion para buscar un carro por algun tipo de parametro


controller.findCar = async (req, res) => {
    const { query = '', field } = req.params;
    console.log(query, field)
    try {
        const conn = await getConnection();
        //? Obtener un carro
        const cars = await conn.query(`SELECT * FROM car WHERE ${field} LIKE '%${query}%'`).catch(e => {
            console.log(e)
        });

        if (cars.length == 0) {
            return res.status(200).json({ cars: [], message: 'No se encontraron registros' })

        }
        return res.status(200).json({ cars })
    }
    catch (error) {
        //return res.json({ error: 'Hubo un error en la insertar' })
        res.status(500).json({ error: 'hubo un error' })
    }
}

controller.findEmpyCar = async (req, res) => {

    const conn = await getConnection();
    const cars = await conn.query("SELECT * FROM car ")
    return res.status(200).json({ cars, message: 'No se encontraron registros' })

}

//? Funcion para obtener un carro
controller.getOneCar = async (req, res) => {
    const { id } = req.params;

    try {
        const conn = await getConnection();
        //? Obtener un carro
        const cars = await conn.query("SELECT * FROM  car WHERE id = ? limit 1", id)
        if (cars.length == 0) {
            return res.status(200).json({ message: 'No hay nada que mostrar' })

        }
        return res.status(200).json({ cars })
    }
    catch (error) {
        //return res.json({ error: 'Hubo un error en la insertar' })
        res.status(500).send({ error })
    }
}
//? metodo para poder eliminar un carro

controller.deleteCar = async (req, res) => {

    const { id, public_id } = req.params;

    try {
        const conn = await getConnection();
        //? eliminando de la base de datos
        await conn.query("DELETE FROM car WHERE id = ? ", id)

    }
    catch (error) {
        //return res.json({ error: 'Hubo un error en la insertar' })
        res.status(500).send({ error })
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