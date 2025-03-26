const express = require('express');
const router = express.Router();

/* Destructuring */

const { index, show } = require('../controllers/productsControllers');


/* Index */

router.get('/', index);


/* Show */

router.get('/:id', show);



module.exports = router;