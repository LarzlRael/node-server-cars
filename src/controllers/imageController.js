const { getConnection } = require('../database/database');

const controller = {};

controller.allCars = async (req, res) => {


    try {
        const conn = await getConnection();
        //? convirtiendo a decimal
        const resultado = await conn.query("Select * from car ")

        if (resultado.length == 0) {
            return res.json({rows:'no hay xd'});

        }
        return res.json(resultado);


    } catch (error) {
        console.log(error)
    }
}

controller.insertNewCar = async (req, res) => {
    // try{
    //     const conn = await getConnection();
    //     const resultado = await conn.query("Insert into ......")
    //     return res.json({})
    // }
}


module.exports = controller;