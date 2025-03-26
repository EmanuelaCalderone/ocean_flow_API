const express = require('express');
const router = express.Router();


const { store } = require('../controllers/checkoutControllers');


router.post('/', store);


module.exports = router;