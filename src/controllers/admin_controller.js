const bcrypt = require('bcryptjs');
const { getConnection } = require("../database/database");
const jwt = require('jsonwebtoken');

const controller = {};

//? Admin login
controller.loginAdmin = async (req, res) => {

    const conn = await getConnection();

    const { email, password } = req.body;
    
    const result = await conn.query("SELECT * FROM user WHERE email = ? AND enable = 1 AND role='ADMIN_ROLE' limit 1", email).catch(e => {
        res.status(400).json(e)
    });

    if (result.length !== 0) {


        if (bcrypt.compareSync(password, result[0].password)) {

            delete result[0].password;

            const userdb = result[0];

            const token = jwt.sign({ usuario: userdb }, process.env.SEED, {
                expiresIn: 14400
            })
            return res.status(200).json({
                ok: true,
                token,
                id: userdb.id_user

                //menu: obtenerMenu(userdb.role)
            })
            // TODO crear el menu para mostrar al usuario


        } else {
            // console.log('error de contraseña')
            res.status(400).json({ error: 'Email o contraseña no valido' });
        }
    } else {
        res.status(500).json({ error: 'Email o contraseña no valido' });
    }
}
//? get Admin User
controller.getUserAdmin = async (req, res) => {

    const { id_user } = req.user;
    try {
        const conn = await getConnection();

        const user_db = await conn.query('SELECT * FROM user WHERE id_user = ? AND ROLE = "ADMIN_ROLE" LIMIT 1 ', id_user).catch(e => console.log(e));

        delete user_db[0].password;

        return res.status(200).json({
            ok: true,
            userdb: user_db[0]
        })

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error' });
    }
}

module.exports = controller;    