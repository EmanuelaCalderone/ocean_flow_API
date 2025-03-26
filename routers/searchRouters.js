const express = require('express');
const router = express.Router();

const { search } = require('../controllers/searchControllers')



router.get('/', search);



module.exports = router;