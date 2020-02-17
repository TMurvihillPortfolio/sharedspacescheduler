const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const router = express.Router();

//these routes for users
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/login', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.patch(
    '/updateMyPassword',
    authController.protect,
    authController.updatePassword
);
router.patch('/updateMe', authController.protect, userController.updateMe);
router.patch('/deleteMe', authController.protect, userController.deleteMe);

//these routes more for system admins

//restrict routes to admin only
router
    .route('/')
    .get(
        authController.protect,
        authController.restrictTo('admin'),
        userController.getAllUsers
    )
    .post(userController.createUser);
router
    .route('/:id')
    .get(userController.getUser)
    .patch(userController.updateUser)
    .delete(
        authController.protect,
        authController.restrictTo('admin'),
        userController.deleteUser
    );

module.exports = router;
