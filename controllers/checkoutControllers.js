const connection = require('../data/db');
const { sendOrderConfirmation } = require('../utils/mailer');

const store = (req, res) => {
    const { cart, customer, discountCode, purchaseDate, deliveryDate, paymentMethod } = req.body;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const applyDiscountAndRespond = (discountPercentage = 0) => {
        const discountAmount = (subtotal * discountPercentage) / 100;
        const discountedTotal = subtotal - discountAmount;
        const shipping = discountedTotal > 100 ? 0 : 10;
        const total = discountedTotal + shipping;
        const orderDetails = { cart, customer, total, discountCode, purchaseDate, deliveryDate };

        // Inserisci i dati nel database
        const sql = `
            INSERT INTO orders (
                payment_method, 
                purchase_date, 
                shipping_date, 
                checkout_total, 
                user_name, 
                user_last_name, 
                user_email, 
                user_address, 
                user_tax_code, 
                user_telephone
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            paymentMethod,    // payment_method
            purchaseDate,            // purchase_date
            deliveryDate,            // shipping_date
            total,                   // checkout_total
            customer.name,           // user_name
            customer.surname,       // user_last_name
            customer.email,          // user_email
            customer.address,        // user_address
            customer.taxCode,        // user_tax_code
            customer.phone          // user_telephone
        ];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Errore nel salvataggio dell\'ordine' });
            }

            // Invia la conferma dell'ordine via email
            sendOrderConfirmation(customer.email, orderDetails)
                .then(() => {
                    res.json({
                        message: 'Ordine ricevuto e email di conferma inviata',
                        subtotal,
                        discountAmount,
                        shipping,
                        total
                    });
                })
                .catch((error) => {
                    console.error('Errore invio email:', error);
                    res.status(500).json({ error: 'Errore invio email' });
                });
        });

        console.log(orderDetails);
    };

    if (discountCode) {
        const sql = `
            SELECT * FROM discount_codes 
            WHERE discount_code = ? 
            AND CURDATE() BETWEEN initial_date AND expiration_date
            LIMIT 1
        `;

        connection.query(sql, [discountCode], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database error' });

            if (results.length === 0) {
                return res.status(400).json({ error: 'Codice sconto non valido o scaduto' });
            }

            const discount = results[0];
            applyDiscountAndRespond(discount.discount_value);
        });
    } else {
        applyDiscountAndRespond();
    }
};

module.exports = {
    store
};
