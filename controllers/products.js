const { response, request } = require('express');

const { Category, Product } = require('../models');

const productsGet = async ( req = request, res = response ) => {

  const { skip = 0, limit = 5 } = req.query;
  const queryFilter = { status: true };

  const [ total, products ] = await Promise.all([
    Product.countDocuments( queryFilter ),
    Product.find( queryFilter )
      .populate( 'user', 'name' )
      .populate( 'category', 'name' )
      .skip( Number( skip ) )
      .limit( Number( limit ) )
  ]);

  res.json({
    total,
    products,
  });

};

const productsGetById = async ( req = request, res = response ) => {

  const product = await Product.findById( req.params.id )
    .populate( 'user', 'name' )
    .populate( 'category', 'name' );

  res.status( 200 ).json( product );
};

const productsPost = async ( req = request, res = response ) => {

  const { name, category, price, description } = req.body;

  const dbCategory = await Category.findOne({ name: category.toUpperCase() });

  // data to save
  const data = {
    name,
    category: dbCategory._id,
    user: req.authUser._id,
    price,
    description
  };

  const product = await new Product( data );
  await product.save();

  res.status( 201 ).json( product );
};

const productsPut = async ( req = request, res = response ) => {

  const { id } = req.params;
  const { status, user, category, ...data } = req.body;

  const dbProduct = await Product.findById( id );
  let dbCategory = await Category.findById( dbProduct.category );

  if ( category ) {
    dbCategory = await Category.findOne({ name: category.toUpperCase() });
  }

  data.category = dbCategory._id;
  data.user = req.authUser._id;

  const product = await Product.findByIdAndUpdate( id, data, { new: true } );

  res.json( product );
};

const productsDelete = async ( req = request, res = response ) => {

  const { id } = req.params;
  const product = await Product.findByIdAndUpdate( id, { status: false }, { new: true } );

  res.json( product );
};

module.exports = {
  productsGet,
  productsGetById,
  productsPost,
  productsPut,
  productsDelete,
};
