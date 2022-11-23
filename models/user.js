const { Schema, model } = require('mongoose');

const UserSchema = Schema({

  name: {
    type: String,
    required: [ true, 'Name is mandatory' ],
  },
  email: {
    type: String,
    required: [ true, 'Email is mandatory' ],
    unique: true,
  },
  password: {
    type: String,
    required: [ true, 'Password is mandatory' ],
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    required: true,
    enum: [ 'ADMIN_ROLE', 'USER_ROLE', 'SALES_ROLE' ],
  },
  status: {
    type: Boolean,
    default: true,
  },
  google: {
    type: Boolean,
    default: false,
  },

});

UserSchema.methods.toJSON = function() {
  const { _id, __v, password, ...user } = this.toObject();
  user.uid = _id;

  return user;
};

module.exports = model( 'User', UserSchema );
