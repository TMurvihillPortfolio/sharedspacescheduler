const BookingItem = require('./../models/bookingItemModel');
const handlerFactory = require('./handlerFactory');

exports.createBookingItem = handlerFactory.getAll(BookingItem);

exports.getAllBookingItems = handlerFactory.getAll(BookingItem);
exports.getBookingItem = handlerFactory.getOne(BookingItem);
exports.deleteBookingItem = handlerFactory.deleteOne(BookingItem);
exports.updateBookingItem = handlerFactory.updateOne(BookingItem);

// exports.createBookingItem = async (req, res) => {
//     const newBookingItem = await BookingItem.create(req.body);
//     res.status(200).json({
//         status: 'success',
//         newBookingItem
//     });
// };

exports.getBookingStats = async (req, res) => {
    try {
        const stats = await BookingItem.aggregate([
            {
                $match: {
                    startDateTime: {
                        $gte: new Date(req.query.start),
                        $lte: new Date(req.query.end)
                    }
                }
            },
            // lookup the customer detail
            {
                $lookup: {
                    from: 'bookings',
                    localField: 'invoiceNumber',
                    foreignField: '_id',
                    as: 'booking'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'booking.customer',
                    foreignField: '_id',
                    as: 'customer'
                }
            },
            {
                $lookup: {
                    from: 'rentalrooms',
                    localField: 'rentalRoom',
                    foreignField: '_id',
                    as: 'rentalRoom'
                }
            },
            // Group by customer
            {
                $group: {
                    _id: '$booking.customer',
                    firstName: { $first: '$customer.firstName' },
                    lastName: { $first: '$customer.lastName' },
                    numBookings: { $sum: 1 },
                    total: { $sum: '$subTotal' },
                    bookingDeets: {
                        $push: {
                            roomName: '$rentalRoom.name',
                            start: '$startDateTime',
                            end: '$endDateTime',
                            subTotal: '$subTotal'
                        }
                    }
                }
            }
        ]);
        console.log(stats);
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
