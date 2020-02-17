const Booking = require('./../models/bookingModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const BookingItem = require('../models/bookingItemModel');

exports.getAllBookings = handlerFactory.getAll(Booking);
exports.getBooking = handlerFactory.getOne(Booking);
exports.deleteBooking = handlerFactory.deleteOne(Booking);
exports.updateBooking = handlerFactory.updateOne(Booking);

//can not use factory handler because of add lineItems
exports.createBooking = catchAsync(async (req, res) => {
    //add the invoice to bookings
    const newBooking = await Booking.create(req.body.booking);

    const { bookingitems } = req.body;
    let newItem;
    const itemIds = [];
    // add the lineitems to the bookingslineitemsdb
    const promises = bookingitems.map(async el => {
        newItem = await BookingItem.create({
            invoiceNumber: newBooking._id,
            rentalRoom: el.rentalRoom,
            somefield: el.somefield,
            notes: el.notes,
            startDateTime: el.startDateTime,
            endDateTime: el.endDateTime,
            subTotal: el.subTotal
        });
        itemIds.push(newItem._id);
        await Booking.findByIdAndUpdate(newBooking._id, {
            bookingItems: itemIds
        });
    });

    // wait until all promises resolve
    await Promise.all(promises);
    // send results
    res.status(200).json({
        status: 'success',
        data: newBooking
    });
});

exports.getUserBookings = async (req, res) => {
    try {
        const stats = await Booking.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date('2019-11-01'),
                        $lte: new Date('2019-11-10')
                    }
                }
            },
            {
                $group: {
                    _id: '$customer', //change to a field to group by that field
                    numBookings: { $sum: 1 },
                    avgPrice: { $avg: '$total' },
                    minPrice: { $min: '$total' },
                    maxPrice: { $max: '$total' },
                    total: { $sum: '$total' }
                }
            }
        ]);

        res.status(200).json({
            status: 'success',
            data: stats
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};
