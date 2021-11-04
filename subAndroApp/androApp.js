const express = require('express');
const checkAuth = require('../middlewares/authMiddleware/authMiddleware');
// const headerSetter = require('./androMiddlwares/headerSetter');
const queenRouter = require('../routers/adminRouter/queenRouter');
const productRouter = require('../routers/adminRouter/productRouter');
const offerRouter = require('../routers/adminRouter/offerRouter');
const customerRouter = require('../routers/commonRouter/customerRouter');
const androAuthRouter = require('./androRouters/androAuthRouter');

const app = express();

// common middlewares
// app.use(headerSetter);

// auth middleware
app.use('/api/auth', androAuthRouter);

// admin routers
app.use('/api/admin/queen', checkAuth('queen'), queenRouter);
app.use('/api/admin/product', checkAuth('queen'), productRouter);
app.use('/api/admin/offers', checkAuth('queen'), offerRouter);

// common router
app.use('/api/customer', checkAuth('customer'), customerRouter);

module.exports = app;
