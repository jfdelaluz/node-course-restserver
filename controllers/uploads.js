const { request, response } = require('express');

const {
  uploadFile,
  removeFile,
  getFile,
  uploadFileCloudinary,
  removeFileCloudinary,
  getFileCloudinary
} = require('../helpers/file-helper');
const { User, Product } = require('../models');

const loadFile = async ( req = request, res = response ) => {

  try {
    
    const fileName = await uploadFile( req.files, undefined, 'imgs' );
  
    res.json({
      fileName
    });

  } catch ( error ) {
    res.status( 400 ).json({
      msg: error
    });
  }
};

const updateImage = async ( req = request, res = response ) => {

  const { id, collection } = req.params;
  const model = await getCollectionModel( id, collection, res );

  if ( !model ) {
    return res.status( 400 ).json({
      msg: `Collection ${ collection } has no element with id ${ id }`,
    });
  }
 
  // if ( model.image ) removeFile( collection, model.image );
  if ( model.image ) removeFileCloudinary( collection, model.image );

  // model.image = await uploadFile( req.files, undefined, collection );
  model.image = await uploadFileCloudinary( req.files, undefined, collection );
  await model.save();

  res.json( model );

};

const showImage = async ( req = request, res = response ) => {

  const { id, collection } = req.params;
  const model = await getCollectionModel( id, collection, res );

  if ( !model ) {
    return res.status( 400 ).json({
      msg: `Collection ${ collection } has no element with id ${ id }`,
    });
  }

  // res.sendFile( getFile( collection, model.image ) );
  if ( !model.image ) {
    res.sendFile( getFileCloudinary() );
  } else {
    res.json({
      image: model.image
    });
  }

};

const getCollectionModel = async ( id, collection, res = response ) => {

  let model;

  switch ( collection ) {
    case 'users':
      model = await User.findById( id );
    break;

    case 'products':
      model = await Product.findById( id );
    break;

    default:
      return res.status( 500 ).json({
        msg: 'Collection not managed',
      });
  }  

  return model;

};

module.exports = {
  loadFile,
  updateImage,
  showImage,
};
