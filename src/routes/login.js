const { Router } = require('express');
const queryString = require('query-string');
const axios = require('axios');
const router = Router();


const controller = require('../controllers/login_controller')

//? Rutas bajo el /login
router.post('/', controller.login);


router.get('/login-facebook', (req, res) => {


    const stringifiedParams = queryString.stringify({
        client_id: process.env.FACEBOOK_APP_ID,
        redirect_uri: 'http://localhost:3000/login/verifyloginfacebook',
        scope: ['email', 'user_friends'].join(','), // comma seperated string
        response_type: 'code',
        auth_type: 'rerequest',
        display: 'popup',
    });

    const facebookLoginUrl = `https://www.facebook.com/v4.0/dialog/oauth?${stringifiedParams}`;
    return res.redirect(facebookLoginUrl);
})

router.get('/verifyloginfacebook', async (req, res) => {

    const code = req.query.code
    console.log(code)
    res.send(await getAccessTokenFromCode(code));
});


async function getAccessTokenFromCode(code) {
    
    const { data } = await axios({
        url: 'https://graph.facebook.com/v4.0/oauth/access_token',
        method: 'get',
        params: {
            client_id: process.env.FACEBOOK_APP_ID,
            client_secret: process.env.FACEBOOK_KEY_APP_ID,
            redirect_uri: 'http://localhost:3000',

            code,
        },
    });
    console.log(data); // { access_token, token_type, expires_in }
    return data.access_token;
};

module.exports = router;

