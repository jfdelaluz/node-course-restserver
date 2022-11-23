const { response, request } = require("express");

const isAdminRole = ( req = request, res = response, next ) => {

  if ( !req.authUser ) {
    return res.status( 500 ).json({
      msg: 'Trying role verification before token verification',
    });
  }

  const { name, role } = req.authUser;

  if ( role !== 'ADMIN_ROLE' ) {
    return res.status( 401 ).json({
      msg: `${ name } is not an administrator`,
    });
  }

  next();

};

const hasRole = ( ...roles ) => {
  
  return ( req = request, res = response, next ) => {

    if ( !req.authUser ) {
      return res.status( 500 ).json({
        msg: 'Trying role verification before token verification',
      });
    }

    if ( !roles.includes( req.authUser.role ) ) {
      return res.status( 401 ).json({
        msg: `This action requires one of these roles: ${ roles }`,
      });
    }

    next();
  };
};

module.exports = {
  isAdminRole,
  hasRole
};
