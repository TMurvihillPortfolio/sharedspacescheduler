const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const Email = require('../utils/email');

const signToken = newUserId => {
    return jwt.sign({ id: newUserId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};
const createAndSendToken = (user, statusCode, res) => {
    //sign user in
    const token = signToken(user._id);
    const expires = new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    );
    const cookieOptions = {
        expires,
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
    //res.cookie('jwt', token, cookieOptions);
    res.cookie('JWT3', token, cookieOptions);
    //remove password from output
    user.password = undefined;
    res.status(statusCode).json({
        status: 'success',
        message: `Welcome to Varsity Clinic, ${user.fullName}`,
        token,
        data: {
            user
        }
    });
};
exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        //do not simplify to req.body, needs fields listed specifically so hacker can not create admin role
        salutation: req.body.salutation,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangedAt: req.body.passwordChangedAt
    });
    // DEV URL
    // const url = 'http:127.0.0.1:3000/myProfile';
    // PROD URL
    // const url = 'https://schedulervarsityclinic.herokuapp.com/myProfile';
    // LIVE URL using find and replace -- disabled until email functionality in place
    // const url = 'http://127.0.0.1:3000/myProfile';
    // await new Email(newUser, url).sendWelcome();
    createAndSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    //check if both email and password present
    const { email, password } = req.body;
    if (!email || !password) {
        next(new AppError('Email and password are required.'), 400);
    }
    //check if user exists with that email and validate password
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        res.status(401).json({
            status: 'fail',
            statusCode: 401,
            message:
                'Email or password does not match our records. Please try again.'
        });
        // return;
        return next(new AppError('Incorrect email or password.'), 401);
    }
    //reset password ChangedAt field
    if (user.passwordChangedAt) user.passwordChangedAt = undefined;
    await user.save({ validateBeforeSave: false });
    //login user
    createAndSendToken(user, 200, res);
});
exports.logout = (req, res, next) => {
    res.cookie('JWT3', '', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};
exports.protect = catchAsync(async (req, res, next) => {
    // //initialize variables
    // let token;
    // //get token from header
    // if (
    //     req.headers.authorization &&
    //     req.headers.authorization.startsWith('Bearer')
    // ) {
    //     token = req.headers.authorization.split(' ')[1];
    // } else if (req.cookies.JWT3) {
    //     token = req.cookies.JWT3;
    // }
    // //check if token exists
    // if (!token) {
    //     return next(
    //         new AppError(
    //             'You are not logged in! Please log in to get access.',
    //             401
    //         )
    //     );
    // }
    // //verify token
    // const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // //make sure user still exists
    // const existingUser = await User.findById(decoded.id);
    // if (!existingUser) {
    //     const newError = new AppError(
    //         'User no longer exists for this authorization.'
    //     );
    //     newError.isOperational = true;
    //     return next(newError);
    // }
    // //make sure user did not change password since JWT issued
    // if (existingUser.changedPasswordAfter(decoded.iat)) {
    //     return next(
    //         new AppError('Password has been changed. Please log in again')
    //     );
    // }

    // //if process get here, then all tests passed and access to next middleware is granted
    // req.user = existingUser;

    req.user = "5dd54685e23cde20647fdecb"; //NOT YET IMPLEMENTED *** FOR TESTING ***
    next();
});
exports.isLoggedIn = catchAsync(async (req, res, next) => {
    //NOT YET IMPLEMENTED *** security removed for testing ***
    // //initialize variables
    // const token = req.cookies.JWT3;
    // //get token from header
    // if (req.cookies.JWT3) {
    //     //verify token
    //     const decoded = await promisify(jwt.verify)(
    //         token,
    //         process.env.JWT_SECRET
    //     );
    //     //make sure user still exists
    //     const existingUser = await User.findById(decoded.id);
    //     if (!existingUser) {
    //         return next();
    //     }
    //     //make sure user did not change password since JWT issued
    //     if (existingUser.changedPasswordAfter(decoded.iat)) {
    //         return next();
    //     }
    //     //if process get here, then all tests passed and access to next middleware is granted
    //     res.locals.user = existingUser;
    //     return next();
    // }
    next();
});
exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        //NOT YET IMPLEMENTED security removed for public view on portfolio
        // if (!roles.includes(req.user.role)) {
        //     return next(
        //         new AppError(
        //             'You do not have permission to perform this action.',
        //             403
        //         )
        //     );
        // }
        next();
    };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    if (!email)
        return next(
            new AppError('Please include email to reset password', 400)
        );

    const user = await User.findOne({ email });
    if (!email) return next(AppError('User not found.', 404));

    const resetToken = await user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    //send forgot password email

    try {
        // await sendEmail({
        //     email: user.email,
        //     subject: 'Your password reset token. (Valid for 10 minutes.)',
        //     message
        // });
        const resetURL = `${req.protocol}://${req.get(
            'host'
        )}/resetPassword?token=${resetToken}`;
        await new Email(user, resetURL).sendPasswordReset();

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email.'
        });
    } catch (error) {
        user.createPasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new AppError('Error sending email. Please try again later.'),
            500
        );
    }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
    //get user
    const hashedUserSentToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    //check if token expired and if user exists and change password
    const user = await User.findOne({
        passwordResetToken: hashedUserSentToken,
        passwordResetExpires: { $gte: Date.now() }
    });
    if (!user) {
        return next(
            new AppError(
                'Authorization is invalid or expired. Please try again.'
            )
        );
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createAndSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    if (
        !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
        return next(
            new AppError(
                'Your current password is does not match our records.',
                401
            )
        );
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    createAndSendToken(user, 200, res);
});
