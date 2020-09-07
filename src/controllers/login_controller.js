let bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { getConnection } = require("../database/database");


const controller = {};

// Login 
controller.login = async (req, res) => {

    const conn = await getConnection();

    const { email, password } = req.body;
    const result = await conn.query('SELECT * FROM user WHERE email = ?', email);

    console.log(result)

    if (result.length !== 0) {
        if (bcrypt.compareSync(password, result[0].password)) {
            delete result[0].password;
            // return res.json(result[0]);
            const userdb = result[0];
            
            const token = jwt.sign({ usuario: userdb }, process.env.SEED, {
                expiresIn: 14400
            })
            return res.status(200).json({
                ok: true,
                token,
                userdb,
                id: userdb.id_user,
                //menu: obtenerMenu(userdb.role)
            })
            // TODO crear el menu para mostrar al usuario


        } else {
            // console.log('error de contraseña')
            res.json({ error: 'email o contraseña no valido' });
        }
    } else {
        //console.log('el usuario no existe');
        res.status(500).json({ error: 'Server Error' });
    }

}


module.exports = controller;