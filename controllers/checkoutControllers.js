const connection = require('../data/db');
const { sendOrderConfirmation } = require('../utils/mailer');

const store = (req, res) => {
    const { cart, customer, discountCode } = req.body;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const applyDiscountAndRespond = (discountPercentage = 0) => {
        const discountAmount = (subtotal * discountPercentage) / 100;
        const discountedTotal = subtotal - discountAmount;
        const shipping = discountedTotal > 100 ? 0 : 10;
        const total = discountedTotal + shipping;
        const orderDetails = { cart, customer, total, discountCode };



        sendOrderConfirmation(customer.email, orderDetails)
            .then(() => {
                console.log('Email inviata con successo');
                res.json({
                    message: 'Order received and confirmation email sent',
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
                return res.status(400).json({ error: 'Invalid or expired discount code' });
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
