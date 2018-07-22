const swaggerJSDoc = require('swagger-jsdoc');
const fs = require('fs');

// swagger definition
const swaggerDefinition = {
  info: {
    title: 'Node Swagger API',
    version: '1.0.0'
  },
  host: 'localhost:3000',
  basePath: '/'
};

// options for the swagger docs
const options = {
  // import swaggerDefinitions
  swaggerDefinition,
  // path to the API
  apis: ['./src/routes.js']
};

// initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Write swagger.json
fs.writeFile('./swagger.json', JSON.stringify(swaggerSpec, null, 4), err => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('File has been created');
});
