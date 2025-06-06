require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

/* CORS */

const cors = require('cors');

app.use(cors({ origin: 'http://localhost:5173' }));


/* Import Products */

const productsRouter = require('./routers/productsRouters');


/* Import Surfboards */

const surfboardRouter = require('./routers/surfboardsRouters')


/* Import Leashes */

const leashesRouter = require('./routers/leashesRouters');



/* Import Wetsuits */

const wetsuitsRouter = require('./routers/wetsuitsRouters');



/* Import Checkout */

const checkoutRouter = require('./routers/checkoutRouters');



/* Import Search */

const searchRouter = require('./routers/searchRouters');



/* Body parser */

app.use(express.json());



/* Static images */

app.use(express.static('public'));



/* Checkout */

app.use('/checkout', checkoutRouter)


/* Search */

app.use('/search', searchRouter);



/* Surfboards */

app.use('/surfboards', surfboardRouter)



/* Leashes */

app.use('/leashes', leashesRouter);



/* Wetsuits */

app.use('/wetsuits', wetsuitsRouter);



/* Homepage */

app.use('/', productsRouter);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})