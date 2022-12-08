const express = require('express');
var cors = require('cors');
const fileUpload = require('express-fileupload');

const { dbConnection } = require('../database/config');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.paths = {
      auth: '/api/auth',
      users: '/api/users',
      categories: '/api/categories',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads'
    };

    // Database
    this.databaseConnection();

    // Middlewares
    this.middlewares();

    // App Routes
    this.routes();
  };

  async databaseConnection() {
    await dbConnection();
  }

  middlewares() {

    // CORS
    this.app.use( cors() );

    // Read and Parse body
    this.app.use( express.json() );

    // Public folder
    this.app.use( express.static( 'public' ) );

    // File upload
    this.app.use( fileUpload({
      useTempFiles : true,
      tempFileDir : '/tmp/',
      createParentPath: true,
  }));

  };

  routes() {

    this.app.use( this.paths.auth, require( '../routes/auth' ) );
    this.app.use( this.paths.users, require( '../routes/users' ) );
    this.app.use( this.paths.categories, require( '../routes/categories' ) );
    this.app.use( this.paths.products, require( '../routes/products' ) );
    this.app.use( this.paths.search, require( '../routes/search' ) );
    this.app.use( this.paths.uploads, require( '../routes/uploads' ) );

  };

  listen() {
    this.app.listen( this.port, () => {
      console.log( `Server running in port ${ this.port }` );
    });
  };

}

module.exports = Server;
