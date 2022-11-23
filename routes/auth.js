const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields } = require('../middlewares/field-validator');
const { login } = require('../controllers/auth');

const router = Router();

router.post( '/login', [
  check( 'email', 'Email is required' ).isEmail(),
  check( 'password', 'Password is required' ).not().isEmpty(),
  validateFields,
], login );

module.exports = router;
