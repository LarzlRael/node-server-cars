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
    const result = await conn.query('SELECT * FROM user WHERE email = ? limit 1', email);


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
//? Login google

controller.google = async (req, res) => {
    const conn = await getConnection();

    let { token } = req.body;
    try {
        let googleUser = await verify(token);
        const result = await conn.query("SELECT * FROM user WHERE email = ? limit 1", googleUser.email);

        if (result.length !== 0) {
            console.log('usuario ya existe')
        }
        else {
            console.log('no existe este cliente', result)
            await conn.query('INSERT INTO user SET ? ', [googleUser]);
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