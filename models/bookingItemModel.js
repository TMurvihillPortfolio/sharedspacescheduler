const mongoose = require('mongoose');

const bookingItemSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: mongoose.Schema.ObjectId,
            ref: 'Booking'
        },
        rentalRoom: {
            type: mongoose.Schema.ObjectId,
            ref: 'RentalRoom'
        },
        startDateTime: {
            type: Date
        },
        endDateTime: {
            type: Date
        },
        subTotal: {
            type: Number,
            default: 0
        },
        somefield: String,
        notes: String,
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const BookingItem = mongoose.model('BookingItem', bookingItemSchema);

module.exports = BookingItem;
