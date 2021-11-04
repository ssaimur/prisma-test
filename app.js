const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
require('dotenv').config();
const queenAuthRouter = require('./routers/authRouter/authRouter');
const queenRouter = require('./routers/adminRouter/queenRouter');
const productRouter = require('./routers/adminRouter/productRouter');
const offerRouter = require('./routers/adminRouter/offerRouter');
const customerRouter = require('./routers/commonRouter/customerRouter');
const con = require('./dbcon');
const errorHandler = require('./middlewares/errorHandler/errorHandler');
const checkAuth = require('./middlewares/authMiddleware/authMiddleware');
const androApp = require('./subAndroApp/androApp');

app.use(require('morgan')('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

con.connect((err) => {
  if (err) {
    console.log({ err });
  }
  console.log('Conected to database...');
});

app.get('/', (req, res) => {
  res.send('app is running...');
});

// app for android
app.use('/andro', androApp);

// auth router
app.use('/api/auth', queenAuthRouter);

// admin routers
app.use('/api/admin/queen', checkAuth('queen'), queenRouter);
app.use('/api/admin/product', checkAuth('queen'), productRouter);
app.use('/api/admin/offers', checkAuth('queen'), offerRouter);

// common router
app.use('/api/customer', checkAuth('customer'), customerRouter);

// error handler middleware
app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`server is listening at ${port}...`);
});
