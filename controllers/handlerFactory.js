const apiQueryEnhancers = require('../utils/apiQueryEnhancers');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

exports.getAll = Model =>
    catchAsync(async (req, res, next) => {
        // Build query
        const features = new apiQueryEnhancers(Model.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .pagination();

        // Execute query
        const documents = await features.query;
        // Send Results
        res.status(200).json({
            status: 'success',
            results: documents.length,
            data: {
                documents
            }
        });
    });
exports.getOne = Model =>
    catchAsync(async (req, res, next) => {
        const document = await Model.findById(req.params.id);
        if (!document) return next(new AppError('Item not found.', 404));
        res.status(200).json({
            status: 'success',
            data: {
                document
            }
        });
    });
exports.deleteOne = Model =>
    catchAsync(async (req, res, next) => {
        const document = await Model.findByIdAndDelete(req.params.id);
        if (!document) return next(new AppError('Item not found.', 404));
        res.status(200).json({
            status: 'success',
            data: null
        });
    });

exports.updateOne = Model =>
    catchAsync(async (req, res, next) => {
        const updatedDocument = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedDocument) return next(new AppError('Item not found.', 404));
        res.status(200).json({
            status: 'success',
            data: {
                updatedDocument
            }
        });
    });

exports.createOne = Model =>
    catchAsync(async (req, res, next) => {
        const newDocument = await Model.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                newDocument
            }
        });
    });
