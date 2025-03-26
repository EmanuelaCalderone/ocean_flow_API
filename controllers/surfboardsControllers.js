const connection = require('../data/db');


/* Index */

const index = (req, res) => {

    const sql = `
        SELECT 
            products.*
        FROM 
            products
        INNER JOIN 
            surfboards ON products.id = surfboards.product_id
        INNER JOIN 
            categories ON products.category_id = categories.id
        WHERE 
            categories.category_name = 'Surfboards'
    `;

    connection.query(sql, (err, productRes) => {

        if (err) return res.status(500).json({ error: 'Database query failed' });

        const products = productRes.map(product => product)

        res.json(products);

    })

}



/* Show */

const show = (req, res) => {

    const { id } = req.params;

    const surfboardSql = `
    SELECT 
        products.*, 
        surfboards.*,
        categories.category_name
    FROM 
        products
    INNER JOIN 
        surfboards ON products.id = surfboards.product_id
    INNER JOIN 
        categories ON products.category_id = categories.id
    WHERE 
        surfboards.product_id = ?
`;

    connection.query(surfboardSql, [id], (err, results) => {

        // Query error

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) return res.status(404).json({ error: 'Surfboard Details not found' });

        const surfboard = results[0];

        res.json(surfboard);

    })

}

module.exports = {
    index,
    show
}