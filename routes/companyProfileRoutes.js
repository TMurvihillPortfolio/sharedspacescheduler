const express = require('express');
const companyProfileController = require('../controllers/companyProfileController');

const router = express.Router();

router
    .route('/')
    .get(companyProfileController.getAllCompanyProfiles)
    .post(companyProfileController.createCompanyProfile);
router
    .route('/:id')
    .get(companyProfileController.getCompanyProfile)
    .patch(companyProfileController.updateCompanyProfile)
    .delete(companyProfileController.deleteCompanyProfile);

module.exports = router;
