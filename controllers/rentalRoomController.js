const RentalRoom = require('./../models/rentalRoomModel');
const handlerFactory = require('./handlerFactory');

exports.getAllRentalRooms = handlerFactory.getAll(RentalRoom);
exports.getRentalRoom = handlerFactory.getOne(RentalRoom);
exports.deleteRentalRoom = handlerFactory.deleteOne(RentalRoom);
exports.updateRentalRoom = handlerFactory.updateOne(RentalRoom);
exports.createRentalRoom = handlerFactory.createOne(RentalRoom);
