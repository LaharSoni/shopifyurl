const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    customer: {
        name: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        billing_addr: {
            type: String,
            required: true
        }
    },
    payment_mode: {
        type: String,
        required: true
    },
    items: [
        {
            qty: {
                type: Number,
                required: true
            },
            product_id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            amount: {
                type: Number,
                required: true
            }
        }
    ],
    total_amt: {
        type: Number,
        required: true
    },
    shipping_addr: {
        type: String,
        required: true
    },
    order_status: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
