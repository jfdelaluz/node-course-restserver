const { request, response } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validateJWT = async ( req = request, res = response, next ) => {

  const token = req.header( 'x-token' );

  if ( !token ) {
    res.status( 401 ).json({
      msg: 'Missing token in request',
    });
  }

  try {

    const { uid } = jwt.verify( token, process.env.SECRET_OR_PRIVATE_KEY );

    const authUser = await User.findById( uid );

    if ( !authUser ) {
      return res.status( 401 ).json({
        msg: 'Invalid token',
      });
    }

    if ( !authUser.status ) {
      return res.status( 401 ).json({
        msg: 'Invalid token',
      });
    }

    req.authUser = authUser;

    next();
    
  } catch ( error ) {
    console.log( error );
    res.status( 401 ).json({
      msg: 'Invalid token',
    });
  }

};

module.exports = {
  validateJWT
};
