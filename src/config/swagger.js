const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Garage 221 API',
      version: '1.0.0',
      description: 'API RESTful de gestion du Garage 221',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJsdoc(options);