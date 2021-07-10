const User = require('../models/userModel');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');
const catchAsync = require('./../utils/catchAsync');
const ErrorHandler = require('./../utils/errorHandler');

// Register a user      /api/v1/register
exports.registerUser = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const user = await User.create({
        email,
        password,
        name,
        avatar: {
            public_id: 'avatars/avatar-3_ouby9o',
            url: 'https://res.cloudinary.com/ani1997/image/upload/v1623136520/shopIT/avatars/avatar-3_ouby9o.jpg'
        }
    })

    sendToken(user, 201, res);
})

// Login User => /api/v1/login
exports.loginUser = catchAsync(async (req, res, next) => {
    const { email, password } = req.body
    // Email or Password not entered
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password!!', 400))
    }

    const user = await User.findOne({ email }).select('+password')
    // Email entered is wrong
    if (!user) {
        return next(new ErrorHandler('Invalid email', 401))
    }
    // Match Password
    console.log(user.comparePassword)
    const isMatchedPassword = await user.comparePassword(password)
    console.log(isMatchedPassword)
    //Password did't match
    if (!isMatchedPassword) {
        return next(new ErrorHandler('Invalid password'))
    }

    sendToken(user, 201, res);
})

// Logout User   =>     /api/v1/user/logout
exports.logoutUser = catchAsync(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        status: 'success',
        message: 'Logout successfully'
    })
})

// Forgot password =>   /api/v1/user/password/forgot
exports.forgotPassword = catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return next(new ErrorHandler('User not found with this email', 404))
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })
    console.log('Data Saved')
    // Create Password Reset URL
    const resetUrl = `${req.protocol}://${req.hostname}/api/v1/user/password/reset/${resetToken}`
    const message = `Your password reset token is as follows:\n\n${resetUrl}\n\nIf you have not requested this email, please ignore`

    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Reset',
            message
        })

        res.status(200).json({
            status: 'success',
            message: `Email sent to ${user.email}`
        })
    } catch (error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpires = undefined
        await user.save({ validateBeforeSave: false })
    }
})

// Reset password =>   /api/v1/user/password/reset/:token
exports.resetPassword = catchAsync(async (req, res, next) => {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')
    console.log("Params hashed token", resetPasswordToken)
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })
    console.log(user)
    if (!user) {
        return next(new ErrorHandler('Reset Password Token incorrect or expired', 400))
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler('Password does not match', 400))
    }
    console.log('initial', user.password)
    user.password = req.body.password

    console.log('final', user.password)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save()
    sendToken(user, 201, res);
})

// Get User Profile =>      /api/v1/user/profile
exports.getUserProfile = catchAsync(async (req, res, next) => {
    // we get the id of the user from /middlewarers/authMiddleware/isAuthenticatedUser
    const user = await User.findById(req.user.id)

    res.status(200).json({
        status: 'success',
        user
    })
})
// Update/Change Password =>    /api/v1/user/password/update
exports.updatePassword = catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user.id)
    user.password = req.body.password

    res.status(200).json({
        status: 'success',
        message: 'Password Updated/Changed',
        user
    })
})

// Update User Profile =>       /api/v1/user/update
exports.updateUserProfile = catchAsync(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    // update avatar
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        status: 'success',
        message: 'Profile Updated',
        user
    })
})

// Admin Routes

// Get All Admin =>     /api/v1/admin/users
exports.getAllAdmins = catchAsync(async (req, res, next) => {
    const admins = await User.find({ role: 'admin' })

    if (!admins) {
        return next(new ErrorHandler('Admins not found', 500))
    }

    res.status(200).json({
        status: 'success',
        count: admins.length,
        admins
    })
})

// Get Admin User Details =>    /api/v1/admin/:id
exports.getAdminDetails = catchAsync(async (req, res, next) => {
    const admin = await User.findById(req.params.id)

    if (!admin) {
        return next(new ErrorHandler('Invalid ID', 404))
    }

    res.status(200).json({
        status: 'success',
        message: 'Admin User Found',
        admin
    })
})

// Update Admin Profile =>       /api/v1/admin/update/:id
exports.updateAdminProfile = catchAsync(async (req, res, next) => {
    const newAdminData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const admin = await User.findByIdAndUpdate(req.params.id, newAdminData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        status: 'success',
        message: 'Admin Profile Updated',
        admin
    })
})

// Delete Admin =>    /api/v1/admin/:id
exports.deleteAdmin = catchAsync(async (req, res, next) => {
    const admin = await User.findById(req.params.id)

    if (!admin) {
        return next(new ErrorHandler('Invalid ID', 404))
    }

    // Remove avatar from cloudinary - TODO

    res.status(200).json({
        status: 'success',
        message: 'Admin Successfully Deleted',
        admin: null
    })
})
