/* Database */

const connection = require('../data/db');



/* Index */

const index = (req, res) => {

    /* Prendiamo le informazioni dal database */

    const sql = `
    SELECT products.*, categories.category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
    `

    connection.query(sql, (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        const products = results.map(product => product)

        res.json(products);

    })

}



/* Show */

const show = (req, res) => {


    const { id } = req.params;


    // Query per i dettagli del prodotto

    const productSql = `
    SELECT products.*, categories.category_name 
    FROM products
    LEFT JOIN categories ON products.category_id = categories.id 
    WHERE products.id = ?
    `;


    // Query per i dettagli della tavola da surfboards

    const surfboardDetailsSql = `
    SELECT surfboards.*
    FROM surfboards
    WHERE surfboards.product_id = ?
    `;


    // Query per i dettagli delle wetsuits

    const wetsuitsDetailsSql = `
    SELECT wetsuits.*
    FROM wetsuits
    WHERE wetsuits.product_id = ?
    `;


    // Query per i dettagli delle leashes

    const leashesDetailsSql = `
    SELECT leashes.*
    FROM leashes
    WHERE leashes.product_id = ?
    `;


    // Prima query per recuperare il prodotto

    connection.query(productSql, [id], (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) return res.status(404).json({ error: 'Product not found' });


        const product = results[0];


        // Dettagli della tavola da surf

        connection.query(surfboardDetailsSql, [id], (err, results) => {

            if (err) return res.status(500).json({ error: 'Database query failed' });

            if (results.length > 0) { product.surfboardDetails = results[0]; }

        });


        // Dettagli della muta

        connection.query(wetsuitsDetailsSql, [id], (err, results) => {

            if (err) return res.status(500).json({ error: 'Database query failed' });

            if (results.length > 0) { product.wetsuitDetails = results[0]; }

        });


        // Dettagli del leash

        connection.query(leashesDetailsSql, [id], (err, results) => {

            if (err) return res.status(500).json({ error: 'Database query failed' });

            if (results.length > 0) { product.leashDetails = results[0]; }

            res.json(product);

        });

    });

};



module.exports = {
    index,
    show
};