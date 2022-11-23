const { Router } = require('express');
const { check } = require('express-validator');

const {
  validateJWT,
  validateFields,
  isAdminRole,
  hasRole
} = require('../middlewares');

const { isValidRole, emailExists, userByIdExists } = require('../helpers/db-validators');

const {
  usersGet,
  usersPatch,
  usersDelete,
  usersPut,
  usersPost
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet );

router.put('/:id', [
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( userByIdExists ),
  check( 'role' ).custom( isValidRole ),
  validateFields,
], usersPut );

router.post('/', [
  check( 'name', 'Name is required' ).not().isEmpty(),
  check( 'email', 'Invalid email address' ).isEmail(),
  check( 'email' ).custom( emailExists ),
  check( 'password', 'Password must be at least 6 characters long' ).isLength({ min: 6 }),
  check( 'role' ).custom( isValidRole ),
  validateFields,
], usersPost );

router.delete('/:id', [
  validateJWT,
  // isAdminRole,
  hasRole( 'ADMIN_ROLE' ),
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'id' ).custom( userByIdExists ),
  validateFields,
], usersDelete );

router.patch('/', usersPatch );

module.exports = router;
