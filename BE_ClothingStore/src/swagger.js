const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Clothing Store API',
            description: 'API documentation',
            version: '1.0.0',
        },
        servers: [{ url: 'http://localhost:8000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        './src/routes/authRoutes.js',
        './src/routes/userRoutes.js',
        './src/routes/profileRoutes.js',
        './src/routes/productRoutes.js',
        './src/routes/categoryRoutes.js',
        './src/routes/orderManagementRoutes.js',
    ],
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;