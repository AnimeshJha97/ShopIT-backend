const express = require('express');
const router = express.Router();
const { getAllProducts,
    getProduct,
    addProducts,
    updateProduct,
    deleteProduct,
    createProduct,
    deleteProducts } = require('../controllers/productController.js');

const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authMiddleware')

router
    .route('/products')
    .get(getAllProducts)

router
    .route('/admin/products')
    .post(isAuthenticatedUser, authorizeRoles('admin'), addProducts)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProducts);

router
    .route('/product/:id')
    .get(getProduct)

router
    .route('/admin/product/:id')
    .patch(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

router
    .route('/admin/product/new')
    .post(isAuthenticatedUser, createProduct);

module.exports = router;