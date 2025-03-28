const nodemailer = require('nodemailer');

// Configurazione per Gmail con App Password
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'surfoceanoceanflow@gmail.com', // Email Gmail reale
        pass: 'nzna zqse zhbw jyqf ' // App Password generata
    }
});

const sendOrderConfirmation = (customerEmail, orderDetails) => {
    const { customer, cart, total } = orderDetails;

    // Crea la lista dei prodotti
    const itemsList = cart.map(item => `- ${item.product_name} x${item.quantity}`).join('\n');

    const message =
        `Grazie per il tuo ordine, ${customer.name}!

Dettagli ordine:
${itemsList}

Totale: €${total}`;

    // Email per il cliente
    const customerMail = {
        from: '"Oceanflow" <surfoceanoceanflow@gmail.com>',
        to: customerEmail,
        subject: 'Conferma Ordine - Oceanflow',
        text: message
    };

    // Email per il venditore
    const vendorMail = {
        from: '"Oceanflow" <surfoceanflow@gmail.com>',
        to: 'vendite@oceanflow.com',
        subject: `Nuovo ordine da ${customer.name}`,
        text: message
    };

    // Invia le email al cliente e al venditore
    return Promise.all([
        transporter.sendMail(customerMail)
            .then(info => console.log("Email al cliente inviata:", info))
            .catch(error => console.error("Errore invio email al cliente:", error)),
        transporter.sendMail(vendorMail)
            .then(info => console.log("Email al venditore inviata:", info))
            .catch(error => console.error("Errore invio email al venditore:", error))
    ]);
};

// Test di invio email
transporter.sendMail({
    from: '"Test Oceanflow" <surfoceanflow@gmail.com>',
    to: 'emanuu_ela@libero.it', // Inserisci un indirizzo reale (tuo)
    subject: 'Test Email',
    text: 'Questa è una email di test.'
})
    .then(info => console.log('Email di test inviata:', info))
    .catch(error => console.error('Errore invio email di test:', error));

module.exports = { sendOrderConfirmation };
