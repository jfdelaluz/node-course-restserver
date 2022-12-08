const jwtValidator = require('../middlewares/jwt-validator');
const roleValidator = require('../middlewares/role-validator');
const fieldValidator = require('../middlewares/field-validator');
const fileUploaderValidator = require('../middlewares/file-uploaded-validator');

module.exports = {
  ...jwtValidator,
  ...roleValidator,
  ...fieldValidator,
  ...fileUploaderValidator,
};
