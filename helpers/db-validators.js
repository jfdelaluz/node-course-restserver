const { Category, Product, Role, User } = require('../models');

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

const categoryByIdExists = async ( id ) => {
  const categoryExists = await Category.findById( id );
  if ( !categoryExists ) {
    throw new Error( `Category with id ${ id } does not exist` );
  }
};

const categoryByNameExists = async ( name ) => {
  const categoryExists = await Category.findOne({ name: name.toUpperCase(), status: true });
  if ( !categoryExists ) {
    throw new Error( `Category ${ name } does not exist` );
  }
};

const productByIdExists = async ( id ) => {
  const productExists = await Product.findById( id );
  if ( !productExists ) {
    throw new Error( `Product with id ${ id } does not exist` );
  }
};

const productByNameExists = async ( name ) => {
  const productExists = await Product.findOne({ name });
  if ( productExists ) {
    throw new Error( `Product ${ name } already exists` );
  }
};

module.exports = {
  isValidRole,
  emailExists,
  userByIdExists,
  categoryByIdExists,
  categoryByNameExists,
  productByIdExists,
  productByNameExists,
};
