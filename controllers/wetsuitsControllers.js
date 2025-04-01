const connection = require('../data/db');


/* Index */

const index = (req, res) => {

    const { minPrice, maxPrice } = req.query;


    let sql = `
        SELECT 
        products.*, 
        wetsuits.* 
        FROM products
        INNER JOIN wetsuits ON products.id = wetsuits.product_id
        INNER JOIN categories ON products.category_id = categories.id
        WHERE categories.category_name = 'Wetsuits'
    `;

    const params = [];

    if (minPrice && maxPrice) {
        sql += `AND products.price BETWEEN ? AND ?`;
        params.push(minPrice, maxPrice);
    }

    connection.query(sql, params, (err, productRes) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        const products = productRes.map(product => product)

        res.json(products);

    })

}



/* Show */

const show = (req, res) => {

    const { id } = req.params;

    const wetsuitSql = `
    SELECT 
        products.*, 
        wetsuits.*,
        categories.category_name
    FROM 
        products
    INNER JOIN 
        wetsuits ON products.id = wetsuits.product_id
    INNER JOIN 
        categories ON products.category_id = categories.id
    WHERE 
        wetsuits.product_id = ?
`;

    connection.query(wetsuitSql, [id], (err, results) => {

        // Query error

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) return res.status(404).json({ error: 'wetsuit Details not found' });

        const wetsuit = results[0];

        res.json(wetsuit);

    })

}

module.exports = {
    index,
    show
}