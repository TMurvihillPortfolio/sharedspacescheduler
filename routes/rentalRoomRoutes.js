const express = require('express');
const rentalRoomController = require('../controllers/rentalRoomController');

const router = express.Router();

router
    .route('/')
    .get(rentalRoomController.getAllRentalRooms)
    .post(rentalRoomController.createRentalRoom);
router
    .route('/:id')
    .get(rentalRoomController.getRentalRoom)
    .patch(rentalRoomController.updateRentalRoom)
    .delete(rentalRoomController.deleteRentalRoom);

module.exports = router;
