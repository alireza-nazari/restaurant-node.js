const validate = require('validate.js');

const { OrderConstrains: options, orderProducts } = require('./private/validateOptions');
const OrderDAO = require('./private/dao');

exports.getOrders = (req, res) => {
  const { limit, offset } = req;
  OrderDAO.fetchMany({}, { limit, offset })
    .then(orders => res.json(orders))
    .catch(err => res.json(err));
};

exports.createOrder = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  req.body.userId = req.user._id;
  let errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json({ errors });
  }
  errors = {};
  const { products } = req.body;
  if (!(products instanceof Array)) {
    return res.status(400).json({ errors: { products: ['type must be an array'] } });
  }
  if (!products.length) {
    return res.status(401).json({
      errors: {
        products: {
          productId: [
            'Product id can\'t be blank',
          ],
          quantity: [
            'Quantity can\'t be blank',
          ],
        },
      },
    });
  }
  errors = { products: {} };
  products.forEach((prod, index) => {
    errors.products[index] = validate(prod, orderProducts);
  });
  if (JSON.stringify(errors.products) !== '{}') {
    return res.status(422).json({ errors });
  }
  const {
    method, transactionId, address,
  } = req.body;
  req.body.payment = { method, transactionId };
  req.body.shipping = { address };
  console.log(req.body);
  return OrderDAO.createOrder(req.body)
    .then(order => res.json(order))
    .catch(err => res.json(err));
};

exports.addProduct = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: ['Body required'] });
  }
  const { products } = req.body;
  if (!products) {
    return res.status(400).json({ products: ['Products can\'t be blank', 'type must be an array'] });
  }
  if (!(products instanceof Array)) {
    return res.status(400).json({ products: ['type must be an array'] });
  }
  if (!products.length) {
    return res.status(401).json({
      errors: {
        products: {
          productId: [
            'Product id can\'t be blank',
          ],
          quantity: [
            'Quantity can\'t be blank',
          ],
        },
      },
    });
  }
  const errors = { products: {} };
  products.forEach((prod, index) => {
    errors.products[index] = validate(prod, orderProducts);
  });
  if (JSON.stringify(errors.products) !== '{}') {
    return res.status(422).json({ errors });
  }
  const update = {
    $addToSet: {
      products: {
        $each: req.body.products,
      },
    },
  };
  console.log(update);
  return OrderDAO.update({ _id: req.params.id }, update)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.getOneOrder = (req, res) => {
  res.json(req.order);
};

exports.getOrdersByUserId = (req, res) => {
  const { limit, offset } = req;
  OrderDAO.fetchMany({ userId: req.user._id }, { limit, offset })
    .then(orders => res.json(orders))
    .catch(err => res.json(err));
};

exports.updateOrder = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const option = {};
  let errors = {};
  Object.keys(req.body)
    .forEach((el) => {
      if (el in options) {
        option[el] = options[el];
      } else {
        errors[el] = [`${el} is not order property`];
      }
    });
  if (JSON.stringify(errors) !== '{}') {
    return res.status(400).json(errors);
  }
  errors = validate(req.body, option);
  if (errors) {
    return res.status(422).json(errors);
  }
  if (req.body.method) {
    req.body.payment = { method: req.body.method };
    delete req.body.method;
  }
  if (req.body.transactionId) {
    req.body.payment = { transactionId: req.body.transactionId };
    delete req.body.transactionId;
  }
  if (req.body.address) {
    req.body.shipping = { address: req.body.address };
    delete req.body.address;
  }
  const update = {};
  if (JSON.stringify(req.body) !== '{}') {
    update.$set = req.body;
  }
  return OrderDAO.update({ _id: req.params.id }, update)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.deleteOrder = (req, res) => {
  OrderDAO.remove({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.deleteProducts = (req, res) => {
  const query = { _id: req.params.id };
  const update = {
    $pull: { products: req.params.prod_id },
  };
  OrderDAO.update(query, update)
    .then((order) => {
      res.json(order);
    })
    .catch(err => res.json(err));
};
