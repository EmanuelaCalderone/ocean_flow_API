const nodemailer = require('nodemailer');

// Configurazione per Gmail con App Password
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'surfoceanoceanflow@gmail.com', // Email Gmail reale
        pass: 'nzna zqse zhbw jyqf' // App Password generata
    }
});

const sendOrderConfirmation = (customerEmail, orderDetails) => {
    const { customer, cart, total, discountCode } = orderDetails;

    // Creazione del messaggio con tutte le informazioni dell'ordine
    const message = `
        Grazie per il tuo ordine, ${customer.name} ${customer.surname}!

        **Dettagli dell'Ordine**
        Nome: ${customer.name}
        Cognome: ${customer.surname}
        Email: ${customer.email}
        Indirizzo: ${customer.address}
        Telefono: ${customer.phone}
        Metodo di Pagamento: ${customer.paymentMethod}

        Codice Sconto Utilizzato: ${discountCode || 'Nessuno'}
        Totale: €${total.toFixed(2)}

        **Articoli Ordinati**
        ${cart.map(item => `- ${item.product_name} x${item.quantity} (€${item.price})`).join('\n')}

        La gestione della spedizione avviene solitamente entro due giorni dalla ricezione dell'ordine. Una volta che il tuo pacco sarà stato preparato per la spedizione, riceverai un'email di conferma con i dettagli del tracciamento, così potrai monitorare il percorso del tuo ordine in tempo reale.

        Ti ringraziamo per aver scelto i nostri servizi. Per qualsiasi domanda o necessità di assistenza, non esitare a contattarci rispondendo a questa email o visitando la nostra pagina di supporto.

        OCEANFLOW
    `;

    // Creazione del messaggio con tutte le informazioni dell'ordine
    const newOrder = `
        Hai ricevuto un nuovo ordine!

        **Dettagli dell'Ordine**
        Nome: ${customer.name}
        Cognome: ${customer.surname}
        Email: ${customer.email}
        Indirizzo: ${customer.address}
        Telefono: ${customer.phone}
        Metodo di Pagamento: ${customer.paymentMethod}

        Codice Sconto Utilizzato: ${discountCode || 'Nessuno'}
        Totale: €${total.toFixed(2)}

        **Articoli Ordinati**
        ${cart.map(item => `- ${item.product_name} x${item.quantity} (€${item.price})`).join('\n')}`;

    // Email per il cliente
    const customerMail = {
        from: '"Oceanflow" <surfoceanoceanflow@gmail.com>',
        to: customerEmail, // Email dinamica del cliente
        subject: 'Conferma Ordine - Oceanflow',
        text: message
    };

    // Email per il venditore
    const vendorMail = {
        from: '"Oceanflow" <surfoceanoceanflow@gmail.com>',
        to: 'surfoceanoceanflow@gmail.com', // Email statica del venditore
        subject: `Nuovo ordine da ${customer.name} ${customer.surname}`,
        text: newOrder
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

module.exports = { sendOrderConfirmation };
