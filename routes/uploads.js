const { Router } = require('express');
const { check } = require('express-validator');

const { validateFields, validateFileUploaded } = require('../middlewares');
const { loadFile, updateImage, showImage } = require('../controllers/uploads');
const { collectionIsAllowed } = require('../helpers/db-validators');

const router = Router();

router.post( '/', [
  validateFileUploaded,
], loadFile );

router.put( '/:collection/:id', [
  validateFileUploaded,
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'collection' ).custom( c => collectionIsAllowed( c, [ 'users', 'products' ] ) ),
  validateFields
], updateImage );

router.get( '/:collection/:id', [
  check( 'id', 'Invalid ID' ).isMongoId(),
  check( 'collection' ).custom( c => collectionIsAllowed( c, [ 'users', 'products' ] ) ),
  validateFields
], showImage );

module.exports = router;
