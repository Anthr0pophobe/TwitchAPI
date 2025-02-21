import swaggerJSDoc from 'swagger-jsdoc';

// Configuration de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Twitch API',
      version: '1.0.0',
      description: 'API for fetching Twitch user info and schedule',
    },
  },
  apis: ['./src/app/routes/*.ts'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerSpec;
