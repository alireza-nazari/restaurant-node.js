const validate = require('validate.js');

const { OrderConstrains: options, orderProducts } = require('./private/validateOptions');
const OrderDAO = require('./private/dao');

exports.getOrders = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const orders = await OrderDAO.fetchMany({}, { limit, offset });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.createOrder = async (req, res, next) => {
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
    method, address,
  } = req.body;
  req.body.payment = { method };
  req.body.shipping = { address };
  try {
    const order = await OrderDAO.insert(req.body);
    return res.json(order);
  } catch (e) {
    return next(e);
  }
};

exports.addProduct = async (req, res, next) => {
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
  try {
    const updatedData = await OrderDAO.update({ _id: req.params.id }, update);
    return res.json(updatedData);
  } catch (e) {
    return next(e);
  }
};

exports.getOneOrder = (req, res) => {
  res.json(req.order);
};

exports.getOrdersByUserId = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const orders = await OrderDAO.fetchMany({ userId: req.user._id }, { limit, offset });
    res.json(orders);
  } catch (e) {
    next(e);
  }
};

exports.updateOrder = async (req, res, next) => {
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
    return res.status(422).json({ errors });
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
  try {
    const updatedData = await OrderDAO.update({ _id: req.params.id }, update);
    return res.json(updatedData);
  } catch (e) {
    return next(e);
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const deletedData = await OrderDAO.remove({ _id: req.params.id });
    res.json(deletedData);
  } catch (e) {
    next(e);
  }
};

exports.deleteProducts = async (req, res, next) => {
  const query = { _id: req.params.id };
  const update = {
    $pull: { products: req.params.prod_id },
  };
  try {
    const order = await OrderDAO.update(query, update);
    res.json(order);
  } catch (e) {
    next(e);
  }
};
