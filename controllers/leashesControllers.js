const connection = require('../data/db');


/* Index */

const index = (req, res) => {

    const sql = `
        SELECT 
            products.*
        FROM 
            products
        INNER JOIN 
            leashes ON products.id = leashes.product_id
        INNER JOIN 
            categories ON products.category_id = categories.id
        WHERE 
            categories.category_name = 'Leashes'
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

    const leashSql = `
    SELECT 
        products.*, 
        leashes.*,
        categories.category_name
    FROM 
        products
    INNER JOIN 
        leashes ON products.id = leashes.product_id
    INNER JOIN 
        categories ON products.category_id = categories.id
    WHERE 
        leashes.product_id = ?
`;

    connection.query(leashSql, [id], (err, results) => {

        // Query error

        if (err) return res.status(500).json({ error: 'Database query failed' });

        if (results.length === 0) return res.status(404).json({ error: 'Leash Details not found' });

        const leash = results[0];

        res.json(leash);

    })

}

module.exports = {
    index,
    show
}