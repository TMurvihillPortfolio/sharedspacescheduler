const AppError = require('./../utils/AppError');

const handleJWTError = () => {
    const newError = new AppError(
        'Invalid authorization. Please log in again.',
        401
    );
    newError.isOperational = true;
    return newError;
};
const handleJWTExpiredError = () => {
    const newError = new AppError(
        'Authorization expired. Please log in again.',
        401
    );
    newError.isOperational = true;
    return newError;
};
const handleCastErrorDB = errCopy => {
    const message = `Invalid ${errCopy.path}: ${errCopy.value}`;
    return new AppError(message, 404);
};
const handleDuplicateInputDB = errCopy => {
    const value = errCopy.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
    const message = `Name ${value} already used. Please choose another name.`;
    return new AppError(message, 404);
};
const handleValidationErrorDB = errCopy => {
    const errorMessageArray = Object.values(errCopy.errors).map(
        el => el.message
    );
    const message = `Invalid input(s). ${errorMessageArray.join('. ')}`;
    return new AppError(message, 404);
};

const sendErrorDev = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        res.status(err.statusCode).render('error', {
            title: 'Something went wrong.',
            msg: err.message
        });
    }
};
const sendErrorProd = (err, req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        //caused by client interactivity, send full error message
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
            //caused by a bug or similar, send client error message w/o details
        }
        return res.status(err.statusCode).json({
            status: 'error',
            message: `Something went wrong. Please try again. (prod) ${err.message}`
        });
        //NOT YET IMPLEMENTED -- add to error logs
    }
    if (err.isOperational) {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        });
        //caused by a bug or similar, send client error message w/o details
    }
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong.',
        msg: 'Please try again later.'
    });
    //NOT YET IMPLEMENTED -- add to error logs
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(err, req, res);
    } else {
        let errCopy = { ...err };
        errCopy.message = err.message;

        if (errCopy.name === 'CastError') errCopy = handleCastErrorDB(errCopy);
        if (errCopy.code === 11000) errCopy = handleDuplicateInputDB(errCopy);
        if (errCopy.name === 'ValidationError')
            errCopy = handleValidationErrorDB(errCopy);
        if (errCopy.name === 'JsonWebTokenError') errCopy = handleJWTError();
        if (errCopy.name === 'TokenExpiredError')
            errCopy = handleJWTExpiredError();
        sendErrorProd(errCopy, req, res);
    }
};
