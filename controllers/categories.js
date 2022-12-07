const { response, request } = require('express');

const Category = require('../models/category');

const categoriesGet = async ( req = request, res = response ) => {

  const { skip = 0, limit = 5 } = req.query;
  const queryFilter = { status: true };

  const [ total, categories ] = await Promise.all([
    Category.countDocuments( queryFilter ),
    Category.find( queryFilter )
      .populate( 'user', 'name' )
      .skip( Number( skip ) )
      .limit( Number( limit ) )
  ]);

  res.json({
    total,
    categories,
  });

};

const categoriesGetById = async ( req = request, res = response ) => {

  const category = await Category.findById( req.params.id ).populate( 'user', 'name' );

  res.status( 200 ).json( category );
};

const categoriesPost = async ( req = request, res = response ) => {

  const name = req.body.name.toUpperCase();

  const dbCategory = await Category.findOne({ name });

  if ( dbCategory ) {
    return res.status( 400 ).json({
      msg: `Category ${ dbCategory.name } already exists`,
    });
  }

  // data to save
  const data = {
    name,
    user: req.authUser._id,
  };

  const category = await new Category( data );
  await category.save();

  res.status( 201 ).json( category );
};

const categoriesPut = async ( req = request, res = response ) => {

  const { id } = req.params;
  const { status, user, ...data } = req.body;

  data.name = data.name.toUpperCase();
  data.user = req.authUser._id;

  const category = await Category.findByIdAndUpdate( id, data, { new: true } );

  res.json( category );
};

const categoriesDelete = async ( req = request, res = response ) => {

  const { id } = req.params;
  const category = await Category.findByIdAndUpdate( id, { status: false }, { new: true } );

  res.json( category );
};

module.exports = {
  categoriesGet,
  categoriesGetById,
  categoriesPost,
  categoriesPut,
  categoriesDelete,
};
