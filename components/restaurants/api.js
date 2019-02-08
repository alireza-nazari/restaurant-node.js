const express = require('express');

const restaurants = require('./service');

const restaurantsRouter = express.Router();

restaurantsRouter.get('/', restaurants.getRestaurants);
restaurantsRouter.get('/:id', restaurants.getRestaurantsById);
restaurantsRouter.get('/:id/menu', restaurants.getRestaurantsById);

module.exports = restaurantsRouter;
