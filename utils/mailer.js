const nodemailer = require('nodemailer');

// Configurazione per Gmail con App Password
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'surfoceanflow@gmail.com', // Email Gmail reale
        pass: 'nzna zqse zhbw jyqf' // App Password generata
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
        from: '"Oceanflow" <surfoceanflow@gmail.com>',
        to: customerEmail, // Usa l'email dinamica del cliente
        subject: 'Conferma Ordine - Oceanflow',
        text: message
    };

    // Email per il venditore
    const vendorMail = {
        from: '"Oceanflow" <surfoceanflow@gmail.com>',
        to: 'vendite@oceanflow.com', // Email del venditore (statica)
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

// Test di invio email (usa un'email dinamica per simulare l'input del cliente)
const customerTestEmail = 'emanuu_ela@libero.it'; // Sostituisci con una email di test valida
sendOrderConfirmation(customerTestEmail, {
    customer: { name: "Emanuela", email: customerTestEmail },
    cart: [
        { product_name: "Surfboard", quantity: 1, price: 500 },
        { product_name: "Wetsuit", quantity: 1, price: 300 }
    ],
    total: 800
})
    .then(() => console.log("Test completato: email inviate con successo"))
    .catch(error => console.error("Errore nel test di invio email:", error));

module.exports = { sendOrderConfirmation };
