const fs = require('fs');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple-Supermart API with OAuth',
      version: '3.0.0',
      description: 'CRUD API with GitHub OAuth2 authentication',
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000',
        description: 'Dynamic server URL',
      },
      {
        url: 'https://cse341-supermart-crud-api.onrender.com',
        description: 'Production server',
      },
    ],
  },
  apis: [
    path.resolve(__dirname, '../routes/productRoutes.js'),
    path.resolve(__dirname, '../routes/categoryRoutes.js'),
  ],
};

const specs = swaggerJsdoc(options);

// Generate swagger.json file
const outputPath = path.resolve(__dirname, 'swagger.json');
fs.writeFileSync(outputPath, JSON.stringify(specs, null, 2), 'utf-8');

// Export a function to use in your main app
const setupSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};

module.exports = setupSwagger;
