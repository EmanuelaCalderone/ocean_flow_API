const connection = require('../data/db');


const search = (req, res) => {

    const { query, order } = req.query;

    let sql = `
    SELECT products.*, categories.category_name
    FROM products
    JOIN categories ON products.category_id = categories.id
    WHERE products.product_name LIKE ?
    OR products.product_description LIKE ?
`;

    const params = [`%${query}%`, `%${query}%`];

    // Se l'utente ha specificato un ordinamento, lo aggiungiamo
    if (order && order.toLowerCase() === 'desc') {
        sql += ` ORDER BY products.price DESC`;
    } else if (order && order.toLowerCase() === 'asc') {
        sql += ` ORDER BY products.price ASC`;
    }

    connection.query(sql, [`%${query}%`, `%${query}%`], (err, results) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) { return res.status(404).json({ message: 'Product not found' }); }

        res.json(results);

    });

};


module.exports = { search };