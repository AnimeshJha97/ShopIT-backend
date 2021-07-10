const User = require("../models/userModel")
const catchAsync = require("../utils/catchAsync");
const jwt = require('jsonwebtoken')
const ErrorHandler = require("../utils/errorHandler");

// Checks if user is authenticated
exports.isAuthenticatedUser = catchAsync(async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return next(new ErrorHandler('Login first to access'));
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)
    // used further to get User Profile by using ID
    req.user = await User.findById(decode.id)

    next()
})

// Authorize roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            next(new ErrorHandler(`Role (${req.user.role}) is not authorized to access this resource`, 403))
        }
        next()
    }
}