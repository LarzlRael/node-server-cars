
var bcrypt = require('bcryptjs');

const { getConnection } = require("../database/database");


const controller = {};

controller.allUsers = async (req, res) => {

    try {
        const conn = await getConnection();
        //? convirtiendo a decimal
        const resultado = await conn.query("Select id_user,name,last_name,email,image,direccion,rol,email,google from user ")

        if (resultado.length == 0) {
            return res.json({ rows: 'no hay xd' });

        }
        return res.json(resultado);


    } catch (error) {
        console.log(error)
    }
}

//? para poder user nuevo usuario
controller.newuser = async (req, res) => {

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

        return res.json({ userExists: true, error: `El email ${email} ya fue registrado ` });
    }

    try {

        await conn.query("INSERT INTO user set ?", [newUser]);
        res.json({ added: true })
    } catch (error) {
        res.json({ added: false, error })
    }

}



module.exports = controller;