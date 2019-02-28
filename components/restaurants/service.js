const validate = require('validate.js');

const RestaurantsDAO = require('./private/dao');
const options = require('./private/validateOptions');

exports.createRestaurants = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json({ errors });
  }
  req.body.address = {
    country: req.body.country,
    city: req.body.city,
  };
  if (req.file) {
    req.body.avatar = req.file.filename;
  }
  try {
    const restauran = await RestaurantsDAO.insert(req.body);
    return res.json(restauran);
  } catch (e) {
    return next(e);
  }
};

exports.getRestaurants = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const restaurants = RestaurantsDAO.fetchMany({}, { limit, offset });
    restaurants.map((restaurant) => {
      restaurant.avatar = `images/restaurants/${restaurant.avatar}`;
      return restaurant;
    });
    return res.json(restaurants);
  } catch (e) {
    return next(e);
  }
};

exports.getRestaurantsById = async (req, res, next) => {
  try {
    const restaurant = await RestaurantsDAO.getRestaurant({ _id: req.params.id });
    if (!restaurant) {
      return res.status(400).json({ message: 'no such restauran' });
    }
    restaurant.products.map((product) => {
      product.image = `images/products/${product.image}`;
      return product;
    });
    restaurant.avatar = `images/restaurants/${restaurant.avatar}`;
    return res.json(restaurant);
  } catch (e) {
    return next(e);
  }
};

// exports.updeteById = (req, res) => {};

exports.deleteRestaurnt = async (req, res, next) => {
  try {
    const deletedData = await RestaurantsDAO.remove({ _id: req.params.id });
    res.json(deletedData);
  } catch (e) {
    next(e);
  }
};

exports.addProducts = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, { productId: { presence: true } });
  if (errors) {
    return res.status(422).json({ errors });
  }
  const { productId } = req.body;
  const update = {};
  if ((productId instanceof Array)) {
    update.$addToSet = {
      products: {
        $each: productId,
      },
    };
  } else {
    update.$addToSet = {
      products: productId,
    };
  }
  try {
    const updatedData = await RestaurantsDAO.update({ _id: req.params.id }, update);
    return res.json(updatedData);
  } catch (e) {
    return next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  const query = { _id: req.params.id };
  const update = {
    $pull: { products: req.params.prod_id },
  };
  try {
    const order = await RestaurantsDAO.update(query, update);
    res.json(order);
  } catch (e) {
    next(e);
  }
};

exports.removeAll = async (req, res, next) => {
  try {
    const data = await RestaurantsDAO.removeAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
};
