const Role = require('../models/role');
const User = require('../models/user');

const isValidRole = async ( role = '' ) => {
  const roleExists = await Role.findOne({ role });
  if ( !roleExists ) {
    throw new Error( `Role ${ role } is invalid` );
  }
};

const emailExists = async ( email = '' ) => {
  const emailExists = await User.findOne({ email });
  if ( emailExists ) {
    throw new Error( `Email address: ${ email } already registered` );
  }
};

const userByIdExists = async ( id ) => {
  const userExists = await User.findById( id );
  if ( !userExists ) {
    throw new Error( `User with id ${ id } not registered` );
  }
};

module.exports = {
  isValidRole,
  emailExists,
  userByIdExists,
};
