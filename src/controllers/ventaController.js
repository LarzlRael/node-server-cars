const { getConnection } = require("../database/database");

const controller = {};

controller.payPerCar = async (req, res) => {

    const { id_user, id_car, price } = req.body;

    try {
        const conn = await getConnection();

        const payCar = await conn.query('INSERT INTO venta(id_user,id_car,precio) values (?,?,?)', [id_user, id_car, price]).catch(e => console.log(e));

        return res.status(200).json({
            ok: true,
            payCar:'Venta realizada con Exito'
        })

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error', error });
    }
}
controller.history = async(req,res)=>{
    try {
        const conn = await getConnection();

        const user_db = await conn.query(`
        select u.id_user,u.email,u.last_name, c.name_car, u.name,v.id_venta,v.precio,v.vendido_en 
        from user u
        inner join venta v 
        inner join car c on
        v.id_user = u.id_user and 
        v.id_car  = c.id Order by v.id_venta DESC;`).catch(e => console.log(e));

        return res.status(200).json({
            salesRecords: user_db
        })

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error', error });
    }
}

module.exports = controller;    