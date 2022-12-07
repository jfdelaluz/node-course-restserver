const { request, response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const availableCollections = [
  'users',
  'categories',
  'products',
  'roles'
];

const searchUsers = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term );

  if ( isMongoId ) {
    const user = await User.findById( term );
    return res.json({
      results: ( user ) ? [ user ] : [],
    });
  }

  const regex = new RegExp( term, 'i' );

  const users = await User.find({
    $or: [
      { name: regex },
      { email: regex },
    ],
    $and: [
      { status: true },
    ],
  });

  res.json({
    results: users
  });

};

const searchCategories = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term );

  if ( isMongoId ) {
    const category = await Category.findById( term );
    return res.json({
      results: ( category ) ? [ category ] : [],
    });
  }

  const regex = new RegExp( term, 'i' );

  const categories = await Category.find({ name: regex, status: true });

  res.json({
    results: categories
  });
};

const searchProducts = async ( term = '', res = response ) => {

  const isMongoId = ObjectId.isValid( term );

  if ( isMongoId ) {
    const product = await Product.findById( term ).populate( 'category', 'name' );
    return res.json({
      results: ( product ) ? [ product ] : [],
    });
  }

  const regex = new RegExp( term, 'i' );

  const products = await Product.find({
    $or: [
      { name: regex },
      { description: regex },
    ],
    $and: [
      { status: true },
    ],
  })
  .populate( 'category', 'name' );

  res.json({
    results: products
  });

};

const search = ( req = request, res = response ) => {

  const { collection, term } = req.params;

  if ( !availableCollections.includes( collection ) ) {
    return res.status( 400 ).json({
      msg: `Avaiable Collections are: ${ availableCollections }`
    });
  }

  switch ( collection ) {
    case 'users':
      searchUsers( term, res );
    break;
    case 'categories':
      searchCategories( term, res );
    break;
    case 'products':
      searchProducts( term, res );
    break;

    default:
      res.status( 500 ).json({
        msg: 'Search not implemented for collection',
      });
  }

};

module.exports = {
  search
};
