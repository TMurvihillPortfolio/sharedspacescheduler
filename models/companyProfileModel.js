const mongoose = require('mongoose');

const companyProfileSchema = new mongoose.Schema(
    {
        daysInAdvance: {
            type: Number
        },
        studioPrice: {
            type: Number
        },
        studioDiscountPrice: {
            type: Number
        },
        treatmentRoomPrice: {
            type: Number
        },
        treatmentRoomDiscountPrice: {
            type: Number
        },
        mondayOpen: {
            type: String
        },
        mondayClose: {
            type: String
        },
        tuesdayOpen: {
            type: String
        },
        tuesdayClose: {
            type: String
        },
        wednesdayOpen: {
            type: String
        },
        wednesdayClose: {
            type: String
        },
        thursdayOpen: {
            type: String
        },
        thursdayClose: {
            type: String
        },
        fridayOpen: {
            type: String
        },
        fridayClose: {
            type: String
        },
        saturdayOpen: {
            type: String
        },
        saturdayClose: {
            type: String
        },
        sundayOpen: {
            type: String
        },
        sundayClose: {
            type: String
        },
        holidays: {
            type: Array
        }
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    }
);

const CompanyProfile = mongoose.model('CompanyProfile', companyProfileSchema);

module.exports = CompanyProfile;
