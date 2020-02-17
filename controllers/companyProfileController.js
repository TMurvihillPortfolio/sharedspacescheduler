const CompanyProfile = require('./../models/companyProfileModel');
const handlerFactory = require('./handlerFactory');

//exports.getCompanyProfile = handlerFactory.getAll(RentalRoom);
exports.getCompanyProfile = handlerFactory.getOne(CompanyProfile);
exports.deleteCompanyProfile = handlerFactory.deleteOne(CompanyProfile);
exports.updateCompanyProfile = handlerFactory.updateOne(CompanyProfile);
exports.createCompanyProfile = handlerFactory.createOne(CompanyProfile);
