/* Database */

const connection = require('../data/db');



const index = (req, res) => {
    const { minPrice, maxPrice } = req.query;

    let sql = `
        SELECT products.*
        FROM products
        INNER JOIN surfboards ON products.id = surfboards.product_id
        INNER JOIN categories ON products.category_id = categories.id
        WHERE categories.category_name = 'Surfboards'
        `;

    const params = [];

    if (minPrice && maxPrice) {
        sql += `AND products.price BETWEEN ? AND ?`;
        params.push(minPrice, maxPrice);
    }

    connection.query(sql, params, (err, productRes) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });

        const products = productRes.map(product => product);
        res.json(products);
    });
};


module.exports = {
    index
};