const validate = require('validate.js');

const RestaurantsDAO = require('./private/dao');
const options = require('./private/validateOptions');

exports.createRestaurants = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json(errors);
  }
  req.body.address = {
    country: req.body.country,
    city: req.body.city,
  };
  if (req.file) {
    req.body.avatar = req.file.filename;
  }
  return RestaurantsDAO.insert(req.body)
    .then(restauran => res.json(restauran))
    .catch(err => res.json(err));
};

exports.getRestaurants = (req, res) => {
  const { limit, offset } = req;
  RestaurantsDAO.fetchMany({}, { limit, offset })
    .then(restaurants => restaurants.map((restaurant) => {
      restaurant.avatar = `images/restaurants/${restaurant.avatar}`;
      return restaurant;
    }))
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.getRestaurantsById = (req, res) => {
  RestaurantsDAO.getRestaurant({ _id: req.params.id })
    .then((restaurant) => {
      restaurant.products.map((product) => {
        product.image = `images/products/${product.image}`;
        return product;
      });
      restaurant.avatar = `images/restaurants/${restaurant.avatar}`;
      return restaurant;
    })
    .then((data) => {
      if (!data) {
        return res.status(400).json({ message: 'no such restauran' });
      }
      return res.json(data);
    })
    .catch(err => res.json(err));
};

// exports.updeteById = (req, res) => {};

exports.deleteRestaurnt = (req, res) => {
  RestaurantsDAO.remove({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.addProducts = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, { productId: { presence: true } });
  if (errors) {
    return res.status(422).json(errors);
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
  return RestaurantsDAO.update({ _id: req.params.id }, update)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.deleteProduct = async (req, res) => {
  const query = { _id: req.params.id };
  const update = {
    $pull: { products: req.params.prod_id },
  };
  RestaurantsDAO.update(query, update)
    .then((order) => {
      res.json(order);
    })
    .catch(err => res.json(err));
};
