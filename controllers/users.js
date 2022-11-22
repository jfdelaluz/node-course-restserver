const { response, request } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');

const usersGet = async ( req = request, res = response ) => {

  const { skip = 0, limit = 5 } = req.query;
  const queryFilter = { status: true };

  const [ total, users ] = await Promise.all([
    User.countDocuments( queryFilter ),
    User.find( queryFilter )
      .skip( Number( skip ) )
      .limit( Number( limit ) )
  ]);

  res.json({
    total,
    users,
  });
};

const usersPut = async ( req = request, res = response ) => {

  const { id } = req.params;
  const { _id, password, google, email, ...data } = req.body;

  // TODO : validate against db
  if ( password ) {
    // Password encryption
    const salt = bcryptjs.genSaltSync();
    data.password = bcryptjs.hashSync( password, salt );
  }

  const user = await User.findByIdAndUpdate( id, data );

  res.json({
    user
  });
};

const usersPost = async ( req = request, res = response ) => {

  const { name, email, password, role } = req.body;
  const user = new User({ name, email, password, role });

  // Password encryption
  const salt = bcryptjs.genSaltSync();
  user.password = bcryptjs.hashSync( password, salt );

  // DB save
  await user.save();

  res.status( 201 ).json({
    user
  });
};

const usersDelete = async ( req = request, res = response ) => {

  const { id } = req.params;

  const user = await User.findByIdAndUpdate( id, { status: false } );

  res.json( user );
};

const usersPatch = ( req = request, res = response ) => {
  res.json({
    msg: 'API patch - controller',
  });
};

module.exports = {
  usersGet,
  usersPut,
  usersPost,
  usersDelete,
  usersPatch,
};
