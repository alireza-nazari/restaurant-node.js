const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const RS = require('./middleware/request');

const { usersRouter } = require('./components/users');
const { tokenRouter } = require('./components/token');
// const { restaurantsRouter } = require('./components/restaurants');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(RS.parseQuery);

app.use('/users', usersRouter);
app.use('/refresh', tokenRouter);
// app.use('/restaurants', restaurantsRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status || 500).json(err);
});

app.listen(3000);
