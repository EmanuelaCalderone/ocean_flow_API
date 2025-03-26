/* store */

const store = (req, res) => {

    const { cart, customer, discountCode } = req.body;

    // Calcolo del totale

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const shipping = subtotal > 100 ? 0 : 10;

    const total = subtotal + shipping;

    console.log('Order received', {
        customer,
        cart,
        discountCode,
        total
    });

    res.json({
        message: 'Order received',
        total
    });

}


module.exports = {
    store
}