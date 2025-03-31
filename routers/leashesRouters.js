const express = require('express');
const router = express.Router();


const { index, show } = require('../controllers/leashesControllers');
const { getRelatedProducts } = require('../controllers/productsControllers');

/* Index */

router.get('/', index);



/* Show */

router.get('/:id', show);

/* RELATED PRODUCTS */

router.get('/:id/related', getRelatedProducts);



module.exports = router;