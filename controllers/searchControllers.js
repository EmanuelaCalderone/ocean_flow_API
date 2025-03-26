const connection = require('../data/db');


const search = (req, res) => {

    const { query, order = 'asc' } = req.query;

    const sql = `
    SELECT products.*, categories.category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
    WHERE products.product_name LIKE ?
    OR products.product_description LIKE ?
    ORDER BY products.price ${order.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'}
    `

    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) { return res.status(404).json({ message: 'Product not found' }); }

        res.json(results);

    });

};


module.exports = { search };