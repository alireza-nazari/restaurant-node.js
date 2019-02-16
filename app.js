const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const RS = require('./middleware/request');

const usersRouter = require('./components/users/api');
const tokenRouter = require('./components/token/api');
const restaurantsRouter = require('./components/restaurants/api');
const ordersRouter = require('./components/orders/api');
const productsRouter = require('./components/products/api');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(RS.parseQuery);

app.use('/users', usersRouter);
app.use('/refresh', tokenRouter);
app.use('/restaurants', restaurantsRouter);
app.use('/orders', ordersRouter);
app.use('/products', productsRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err);
});

app.listen(3000);
