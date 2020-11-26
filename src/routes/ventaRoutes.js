const {Router} = require('express');
const { payPerCar,history } = require('../controllers/ventaController');

const router = Router();

router.post('/pagar', payPerCar);
router.get('/history', history);



module.exports = router;