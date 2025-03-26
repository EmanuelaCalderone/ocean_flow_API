// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    auth: {
        user: 'fe8a352d4f1e75',
        pass: 'd71a6128ec617c'
    }
});

const sendOrderConfirmation = (customerEmail, orderDetails) => {
    const { customer, cart, total } = orderDetails;

    const itemsList = cart.map(item => `- ${item.product_name} x${item.quantity}`).join('\n');

    const message =
        `Grazie per il tuo ordine, ${customer.name}!

Dettagli ordine:
${itemsList}

Totale: €${total}`
        ;

    // invia prima al cliente
    const customerMail = {
        from: '"Oceanflow" <no-reply@oceanflow.com>',
        to: customerEmail,
        subject: 'Conferma Ordine - Oceanflow',
        text: message
    };

    // invia anche al venditore
    const vendorMail = {
        from: '"Oceanflow" <no-reply@oceanflow.com>',
        to: 'vendite@oceanflow.com',
        subject: `Nuovo ordine da ${customer.name}`,
        text: message
    };

    // ritorna una Promise che aspetta entrambi gli invii
    return Promise.all([
        transporter.sendMail(customerMail),
        transporter.sendMail(vendorMail)
    ]);
};

module.exports = { sendOrderConfirmation };