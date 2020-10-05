
const bcrypt = require('bcryptjs');
const { getConnection } = require("../database/database");
const { validationResult } = require('express-validator');


const controller = {};

//? get all users (only admin users)
controller.allUsers = async (req, res) => {

    try {
        const conn = await getConnection();
        const resultado = await conn.query("Select id_user,name,last_name,email,image,direccion,role,email,google from user ORDER BY role LIMIT 5 ")

        if (resultado.length == 0) {
            return res.json({ rows: 'Registros 0' });
        }
        return res.json(resultado);

    } catch (error) {
        console.log(error)
    }
}
controller.findUser = async (req, res) => {

    const { field, query } = req.params;
    try {
        const conn = await getConnection();
        const users = await conn.query(`Select id_user,name,last_name,email,image,direccion,role,email,google FROM user WHERE ${field} LIKE '%${query}%';`);

        if (users.length == 0) {
            return res.json({ rows: 'Registros 0' });

        }
        return res.json(users);

    } catch (error) {
        console.log(error)
    }
}

controller.enableOrDisableUser = async (req, res) => {

    const { id, enableOrDisable } = req.params;

    console.log(id)
    try {
        const conn = await getConnection();
        const resultado = await conn.query("UPDATE user set enable = ? WHERE id_user = ?", [enableOrDisable, id]);


        return res.json({ user: 'user updated' });

    } catch (error) {
        console.log(error)
    }
}

//? para poder user nuevo usuario
controller.newuser = async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const conn = await getConnection();

    const { name, last_name, email, password, direccion } = req.body;

    // ? encriptando la contraseña
    let salt = bcrypt.genSaltSync(10);
    let encrypt = bcrypt.hashSync(password, salt);


    const newUser = {
        name,
        last_name,
        email,
        password: encrypt,
        direccion,

    }
    const verifyUser = await conn.query('SELECT * FROM user WHERE email = ?', email);
    // TODO ver esta comparacion

    if (verifyUser.length !== 0) {
        return res.status(400).json({ userExists: true, error: `El email ${email} ya fue registrado ` });
    }

    try {

        await conn.query("INSERT INTO user set ?", [newUser]);
        res.json({ added: true })
    } catch (error) {
        res.json({ added: false, error })
    }

}



module.exports = controller;