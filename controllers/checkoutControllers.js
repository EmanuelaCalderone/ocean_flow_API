const { sendOrderConfirmation } = require('../utils/mailer');

const store = (req, res) => {
    const { cart, customer, discountCode } = req.body;

    // Log per verificare cosa arriva dal frontend
    console.log("Dati ricevuti dal frontend:", req.body);

    if (!cart || !customer || !customer.email) {
        console.error("Errore: dati mancanti nel corpo della richiesta");
        return res.status(400).json({ error: 'Dati mancanti: cart o customer' });
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const applyDiscountAndRespond = (discountPercentage = 0) => {
        const discountAmount = (subtotal * discountPercentage) / 100;
        const discountedTotal = subtotal - discountAmount;
        const shipping = discountedTotal > 100 ? 0 : 10;
        const total = discountedTotal + shipping;
        const orderDetails = { cart, customer, total, discountCode };

        // Log per vedere l'ordine dettagliato
        console.log("Dettagli ordine:", orderDetails);

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
                res.status(500).json({ error: 'Errore durante l\'invio delle email' });
            });
    };

    // Log per verificare la presenza del codice sconto
    console.log("Codice sconto ricevuto:", discountCode);

    if (discountCode) {
        const sql = `
            SELECT * FROM discount_codes 
            WHERE discount_code = ? 
            AND CURDATE() BETWEEN initial_date AND expiration_date
            LIMIT 1
        `;

        connection.query(sql, [discountCode], (err, results) => {
            if (err) {
                console.error("Errore nella query del database:", err);
                return res.status(500).json({ error: 'Errore nel database' });
            }

            if (results.length === 0) {
                console.error("Codice sconto non valido o scaduto");
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
