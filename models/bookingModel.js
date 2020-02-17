const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
    {
        invoiceNumber: String,
        customer: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        bookingItems: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'BookingItem'
            }
        ],
        additionalLineItems: [
            {
                type: String,
                price: Number
            }
        ],
        discountType: {
            type: String,
            enum: {
                values: ['none', 'standard', 'admin', 'other'],
                message:
                    'Please choose one of the following: none, standard, admin, other'
            },
            default: 'none'
        },
        specialDiscountAmount: Number,
        specialDiscountPercentage: Number,
        tax: Number,
        total: Number,
        notes: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        },
        partialPayment: {
            type: Number,
            default: 0
        },
        paidInFull: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;
