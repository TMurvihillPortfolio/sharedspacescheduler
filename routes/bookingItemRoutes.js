const express = require('express');
const bookingItemController = require('../controllers/bookingItemController');

const router = express.Router();
router.route('/bookingStats').get(bookingItemController.getBookingStats);
router
    .route('/')
    .get(bookingItemController.getAllBookingItems)
    .post(bookingItemController.createBookingItem);
router
    .route('/:id')
    .get(bookingItemController.getBookingItem)
    .patch(bookingItemController.updateBookingItem)
    .delete(bookingItemController.deleteBookingItem);

module.exports = router;
