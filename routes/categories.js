const { Router } = require('express');
const { check } = require('express-validator');

const {
  categoriesPost,
  categoriesGet,
  categoriesGetById,
  categoriesPut,
  categoriesDelete
} = require('../controllers/categories');
const { categoryByIdExists } = require('../helpers/db-validators');

const {
  validateJWT,
  validateFields,
  isAdminRole
} = require('../middlewares');

const router = Router();

router.get( '/', categoriesGet );

router.get( '/:id', [
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( categoryByIdExists ),
  validateFields,
], categoriesGetById );

router.post( '/', [
  validateJWT,
  check( 'name', 'Name is required' ).not().isEmpty(),
  validateFields,
], categoriesPost );

router.put( '/:id', [
  validateJWT,
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( categoryByIdExists ),
  check( 'name', 'Name is required' ).not().isEmpty(),
], categoriesPut );

router.delete( '/:id', [
  validateJWT,
  isAdminRole,
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( categoryByIdExists ),
  validateFields,
], categoriesDelete );

module.exports = router;
