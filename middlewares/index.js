const jwtValidator = require('../middlewares/jwt-validator');
const roleValidator = require('../middlewares/role-validator');
const fieldValidator = require('../middlewares/field-validator');

module.exports = {
  ...jwtValidator,
  ...roleValidator,
  ...fieldValidator,
};
