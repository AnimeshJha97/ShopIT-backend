const APIFeatures = require('../utils/apiFeatures')
const Products = require('../models/productModel')
const errorHandler = require('../utils/errorHandler')
const catchAsync = require('../utils/catchAsync');

exports.getAllProducts = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Products.find(), req.query).filter().sort().paginate().limitFields();
    const products = await features.query;

    res.status(200).json({
        status: 'success',
        result: products.length,
        data: {
            products
        }
    })
})

exports.getProduct = catchAsync(async (req, res, next) => {
    const product = await Products.findById(req.params.id);

    if (!product) {
        return next(new errorHandler('Product not found by that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.addProducts = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;

    const product = await Products.insertMany(req.body);

    if (!product) {
        return next(new errorHandler('Products cannot be added!!', 500))
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.createProduct = catchAsync(async (req, res, next) => {
    req.body.user = req.user.id;
    const product = await Products.create(req.body);

    if (!product) {
        return next(new errorHandler('Product not added', 500))
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
    const product = await Products.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })

    if (!product) {
        return next(new errorHandler('Product not found by that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            product
        }
    })
})

exports.deleteProduct = catchAsync(async (req, res, next) => {
    const product = await Products.findByIdAndDelete(req.params.id)

    if (!product) {
        return next(new errorHandler('Product not found by that ID', 404))
    }

    res.status(200).json({
        status: 'success',
        data: {
            product: null
        }
    })
})

exports.deleteProducts = catchAsync(async (req, res, next) => {
    const product = await Products.deleteMany()
    res.status(200).json({
        status: 'success',
        data: {
            product: null
        }
    })
})
