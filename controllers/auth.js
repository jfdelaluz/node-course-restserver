const { response } = require('express');
const bcryptjs = require('bcryptjs');

const User = require('../models/user');
const { generateJWT } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async ( req, res = response ) => {

  const { email, password } = req.body;

  try {

    // Verify email exists
    const user = await User.findOne({ email });
    if ( !user ) {
      return res.status( 400 ).json({
        msg: 'Email/Password are incorrect',
      });
    }

    // Verify if user is active
    if ( !user.status ) {
      return res.status( 400 ).json({
        msg: 'Email/Password are incorrect',
      });
    }

    // Verify password
    const validPassword = bcryptjs.compareSync( password, user.password );
    if ( !validPassword ) {
      return res.status( 400 ).json({
        msg: 'Email/Password are incorrect',
      });
    }

    // Generate JWT
    const token = await generateJWT( user.id );

    res.json({
      user,
      token
    });
    
  } catch ( error ) {
    console.log( error );
    return res.status( 500 ).json({
      msg: 'Please contact administrator',
    });
  }

};

const googleSignIn = async ( req, res = response ) => {

  const { id_token } = req.body;

  try {
    
    const { name, image, email } = await googleVerify( id_token );
    let user = await User.findOne({ email });

    if ( !user ) {
      const data = {
        name,
        email,
        password: 'google_default_password',
        image,
        role: 'USER_ROLE',
        google: true,
      };

      user = new User( data );

      await user.save();
    }

    if ( !user.status ) {
      return res.status( 401 ).json({
        msg: 'Please contact administrator, user blocked'
      });
    }

    // Generate JWT
    const token = await generateJWT( user.id );

    res.json({
      user,
      token
    });

  } catch ( error ) {
    console.log( error );
    return res.status( 400 ).json({
      msg: 'Could not verify token',
    });
  }

};

module.exports = {
  login,
  googleSignIn
};
