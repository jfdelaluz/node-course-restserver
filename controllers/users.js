const { response, request } = require('express');

const usersGet = ( req = request, res = response ) => {

  const { q, apikey, page = 1, limit = 10 } = req.query;

  res.json({
    msg: 'API get - controller',
    q,
    apikey,
    page,
    limit,
  });
};

const usersPut = ( req = request, res = response ) => {

  const { id } = req.params;

  res.json({
    msg: 'API put - controller',
    id: id,
  });
};

const usersPost = ( req = request, res = response ) => {

  const { name, age } = req.body;

  res.status( 201 ).json({
    msg: 'API post - controller',
    name,
    age,
  });
};

const usersDelete = ( req = request, res = response ) => {
  res.json({
    msg: 'API delete - controller',
  });
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
