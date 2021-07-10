const express = require('express');
const router = express.Router();

const { registerUser,
    loginUser,
    forgotPassword,
    logoutUser,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile,
    getAllAdmins,
    getAdminDetails,
    updateAdminProfile,
    deleteAdmin } = require('./../controllers/userController');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware')

router
    .route('/user/register')
    .post(registerUser)

router
    .route('/user/login')
    .post(loginUser)

router
    .route('/user/logout')
    .get(logoutUser)

router
    .route('/user/password/forgot')
    .post(forgotPassword)

router
    .route('/user/password/reset/:token')
    .put(resetPassword)

router
    .route('/user/profile')
    .get(isAuthenticatedUser, getUserProfile)

router
    .route('/user/password/update')
    .put(isAuthenticatedUser, updatePassword)

router
    .route('/user/update')
    .put(isAuthenticatedUser, updateUserProfile)

router
    .route('/admin/users')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getAllAdmins)

router
    .route('/admin/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getAdminDetails)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteAdmin)

router
    .route('/admin/update/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateAdminProfile)

module.exports = router;