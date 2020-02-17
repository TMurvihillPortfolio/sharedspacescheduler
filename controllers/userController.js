const User = require('./../models/userModel');
const handlerFactory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/AppError');

exports.getAllUsers = handlerFactory.getAll(User);
exports.getUser = handlerFactory.getOne(User);
exports.deleteUser = handlerFactory.deleteOne(User);
exports.updateUser = handlerFactory.updateOne(User);
exports.createUser = handlerFactory.createOne(User);

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
    //shortcut if password info in body
    if (req.body.password || req.body.passwordConfirm) {
        return next(
            new AppError(
                'This route not for password updates. Please use updateMyPassword.'
            ),
            400
        );
    }
    //filter out unwanted fields in body
    const filteredBody = filterObj(
        req.body,
        'salutation',
        'firstName',
        'lastName',
        'email'
    );
    //update user
    const updatedUser = await User.findByIdAndUpdate(
        req.user.id,
        filteredBody,
        {
            new: true,
            runValidators: true
        }
    );
    //send response
    res.status(200).json({
        status: 'success',
        data: updatedUser
    });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
    await User.findByIdAndUpdate(req.user.id, { isActive: { $ne: false } });

    res.status(204).json({
        status: 'success',
        data: null
    });
});
