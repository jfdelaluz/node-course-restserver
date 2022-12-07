const { Router } = require('express');
const { check } = require('express-validator');

const {
  productsPost,
  productsGet,
  productsGetById,
  productsPut,
  productsDelete
} = require('../controllers/products');
const { productByIdExists, categoryByNameExists, productByNameExists } = require('../helpers/db-validators');

const {
  validateJWT,
  validateFields,
  isAdminRole
} = require('../middlewares');

const router = Router();

router.get( '/', productsGet );

router.get( '/:id', [
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( productByIdExists ),
  validateFields,
], productsGetById );

router.post( '/', [
  validateJWT,
  check( 'name', 'Name is required' ).not().isEmpty(),
  check( 'name' ).custom( productByNameExists ),
  check( 'price', 'Price must be numeric' ).isNumeric(),
  check( 'category' ).not().isEmpty(),
  check( 'category' ).custom( categoryByNameExists ),
  validateFields,
], productsPost );

router.put( '/:id', [
  validateJWT,
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( productByIdExists ),
  validateFields,
], productsPut );

router.delete( '/:id', [
  validateJWT,
  isAdminRole,
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( productByIdExists ),
  validateFields,
], productsDelete );

module.exports = router;
