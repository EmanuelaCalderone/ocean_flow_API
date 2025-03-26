const express = require('express');
const router = express.Router();


/* Destructuring */

const { index } = require('../controllers/surfPriceControllers');



/* Index */

router.get('/', index);



module.exports = router;