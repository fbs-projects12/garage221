const express      = require('express');
const swaggerUi    = require('swagger-ui-express');
const swaggerSpec  = require('./src/config/swagger');
const routes       = require('./src/routes');
const errorHandler = require('./src/middlewares/errorHandler');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;