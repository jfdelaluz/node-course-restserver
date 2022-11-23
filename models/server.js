const express = require('express');
var cors = require('cors');
const { dbConnection } = require('../database/config');

class Server {

  constructor() {
    this.app = express();
    this.port = process.env.PORT;

    this.usersPath = '/api/users';
    this.authPath = '/api/auth';

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

    //CORS
    this.app.use( cors() );

    // Read and Parse body
    this.app.use( express.json() );

    // Public folder
    this.app.use( express.static( 'public' ) );

  };

  routes() {

    this.app.use( this.authPath, require( '../routes/auth' ) );
    this.app.use( this.usersPath, require( '../routes/users' ) );

  };

  listen() {
    this.app.listen( this.port, () => {
      console.log( `Server running in port ${ this.port }` );
    });
  };

}

module.exports = Server;
