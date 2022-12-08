const fs = require('fs');
const path = require('path');

const { v4: uuidv4 } = require('uuid');

const cloudinary = require('cloudinary').v2;
cloudinary.config( process.env.CLOUDINARY_URL );

const defaultNoImagePath = path.join( __dirname, '../assets/no-image.jpg' );
const defaultAllowedExtensions = [ 'png', 'jpg', 'jpeg', 'gif', ];

const uploadFile = ( files, allowedExtensions = defaultAllowedExtensions, folder = '' ) => {

  return new Promise( ( resolve, reject ) => {

    const { file } = files;
    const nameSplitted = file.name.split( '.' );
    const fileExt = nameSplitted[ nameSplitted.length - 1 ];
  
    // Validate file extension
    if ( !allowedExtensions.includes( fileExt ) ) {
      return reject( `File extensions available are ${ allowedExtensions }` );
    }
  
    const tmpName = uuidv4() + '.' + fileExt;
    const uploadPath = path.join( __dirname, '../uploads/', folder, tmpName );
  
    file.mv( uploadPath, ( err ) => {
      if ( err ) return reject( err );
  
      resolve( tmpName );
    });

  });

};

const uploadFileCloudinary = async ( files, allowedExtensions = defaultAllowedExtensions, folder = ''  ) => {

  const { tempFilePath } = files.file;
  const resp = await cloudinary.uploader.upload( tempFilePath );

  return resp.secure_url;

};

const removeFile = ( collection = '', file = '' ) => {

  const filePath = path.join( __dirname, '../uploads/', collection, file );

  if ( fs.existsSync( filePath ) ) {
    fs.unlinkSync( filePath );
  }

};

const removeFileCloudinary = async ( collection = '', file = '' ) => {

  const imageId = file.split( '/' ).pop().split( '.' ).shift();
  
  await cloudinary.uploader.destroy( imageId );

};

const getFile = ( collection = '', file = '' ) => {

  const filePath = path.join( __dirname, '../uploads/', collection, file );

  return ( file !== '' && fs.existsSync( filePath ) ) ? filePath : defaultNoImagePath;

};

const getFileCloudinary = ( collection = '', file = '' ) => {

  return defaultNoImagePath;

};

module.exports = {
  uploadFile,
  uploadFileCloudinary,
  removeFile,
  removeFileCloudinary,
  getFile,
  getFileCloudinary,
};
