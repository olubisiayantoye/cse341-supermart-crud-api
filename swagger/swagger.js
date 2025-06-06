const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Simple-Supermart API with OAuth',
      version: '3.0.0',
      description: 'CRUD API with GitHub OAuth2 authentication'
    },
    servers: [
      {
      url: process.env.BASE_URL || "http://localhost:3000",
      description: "Dynamic server URL",
    },
    {
      url: "https://cse341-supermart-crud-api.onrender.com",
      description: "Production server",
    },
    ],
  },
  apis: ['./routes/productRoutes.js', './routes/categoryRoutes.js'], 
};

const specs = swaggerJsdoc(options);



module.exports = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
