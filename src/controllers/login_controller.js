const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_ID_CLIENT);


const { getConnection } = require("../database/database");


const controller = {};

//? Login email and password
controller.login = async (req, res) => {


    const conn = await getConnection();

    const { email, password } = req.body;
    console.log(email, password)
    const result = await conn.query('SELECT * FROM user WHERE email = ? AND enable = 1 limit 1', email);

    if (result.length !== 0) {

        if (result[0].google) {
            return res.status(400).json({
                ok: false,
                message: 'Usa tu cuenta de google'
            })
        }


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
            res.status(400).json({ error: 'email o contraseña no valido' });
        }
    } else {

        //res.status(500).json({ error: 'Server Error' });
        res.status(400).json({ error: 'email o contraseña no valido' });

    }

}
controller.getUser = async (req, res) => {

    //console.log(req.user.id_user)
    try {
        const conn = await getConnection();

        const user_db = await conn.query('SELECT * FROM user WHERE id_user = ? LIMIT 1', req.user.id_user);

        delete user_db[0].password;

    } catch (error) {
        res.status(500).json({ msg: 'Hubo un error' });
    }
}


//? Login google

controller.google = async (req, res) => {
    const conn = await getConnection();

    let { token } = req.body;
    let result;
    try {
        let googleUser = await verify(token);
        result = await conn.query("SELECT * FROM user WHERE email = ? limit 1", googleUser.email);

        if (result.length !== 0) {
            console.log('usuario ya existe')
        }
        else {

            await conn.query('INSERT INTO user SET ? ', [googleUser]);
            result = await conn.query("SELECT * FROM user WHERE email = ? limit 1", googleUser.email)

        }

        //return res.status(200).json({ ok: true, googleuser: googleUser });

        const userdb = result[0];

        const jwt_token = jwt.sign({ usuario: userdb }, process.env.SEED, {
            expiresIn: 14400
        });

        return res.status(200).json({
            ok: true,
            jwt_token,
            userdb
        })

    } catch (error) {
        return res.status(403).json({ ok: false, error: 'token de google no valido' });
    }
}


//? funcio para verficar el token de gogole para compararlo

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID_CLIENT,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];
    //    console.log(payload)
    return {
        name: payload.given_name,
        last_name: payload.family_name,
        email: payload.email,
        image: payload.picture,
        password: ':3',
        google: true
    }
}

module.exports = controller;


