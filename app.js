const path = require('path');
const express = require('express');
//const Holidays = require('date-holidays');

// const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

const xss = require('xss-clean');
const hpp = require('hpp');
const compression = require('compression');
const cookieParser = require('cookie-parser');

// const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/AppError');
const bookingController = require('./controllers/bookingController');
const bookingItemController = require('./controllers/bookingItemController');
const globalErrorHandler = require('./controllers/errorController');
const rentalRoomRouter = require('./routes/rentalRoomRoutes');
const userRouter = require('./routes/userRoutes');
const bookingRouter = require('./routes/bookingRoutes');
const bookingItemRouter = require('./routes/bookingItemRoutes');
const viewRouter = require('./routes/viewRoutes');
const companyProfileRouter = require('./routes/companyProfileRoutes');

const app = express();
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
console.log(process.env.NODE_ENV);

//const hd = new Holidays('CA', 'ab');

//security
app.use(helmet()); //variety of security protections
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour.'
});
app.use('/api', limiter); //limits calls from each api (brute force attack)
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize()); //must come after express.json statement, eliminate special chars
app.use(xss()); //further data sanitization
app.use(hpp()); //cleans up url parameters, you can whitelist params you want more than one search on

//utilities
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());

// app.get('/addBooking', (req, res) => {
//     res.status(200).render('post');
// });

// *************
//  * ROUTES
//  ************/

//Rental room routes & middleware
app.use('/', viewRouter);
app.use('/api/v1/rentalrooms', rentalRoomRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/bookingItems', bookingItemRouter);
app.use('/api/v1/companyProfile', companyProfileRouter);

//REFACTOR
app.post('/submitBooking', bookingController.createBooking);
app.post('/submitBookingItems', bookingItemController.createBookingItem);

app.all('*', (req, res, next) => {
    next(new AppError(`Page not found (${req.originalUrl}).`, 404));
});

//uncomment when error handler put in place
app.use(globalErrorHandler);

module.exports = app;
