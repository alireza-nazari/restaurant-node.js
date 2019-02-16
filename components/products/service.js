const validate = require('validate.js');

const options = require('./private/validateOptions');
const ProductDAO = require('./private/dao');

exports.getProducts = (req, res) => {
  const { limit, offset } = req;
  ProductDAO.fetchMany({}, { limit, offset })
    .then(products => res.json(products))
    .catch(err => res.json(err));
};

exports.getOneProduct = (req, res) => {
  ProductDAO.fetchOne({ _id: req.params.id })
    .then((product) => {
      if (!product) {
        res.status(400).json({ message: 'no such product' });
      }
      res.json(product);
    })
    .catch(err => res.json(err));
};

exports.createProduct = (req, res) => {
  if (JSON.stringify(req.body) === '{}' && !req.file) {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json(errors);
  }
  if (req.file) {
    req.body.image = req.file.filename;
  }
  req.body.categories = req.body.category;
  return ProductDAO.insert(req.body)
    .then(product => res.json(product))
    .catch(err => res.json(err));
};

exports.updateProduct = (req, res) => {
  if (JSON.stringify(req.body) === '{}' && !req.files) {
    return res.status(400).json({ message: 'Body required' });
  }
  const option = {};
  let errors = {};
  const bodyIsArray = Object.keys(req.body);
  if (bodyIsArray.length) {
    bodyIsArray.forEach((el) => {
      if (el in options) {
        option[el] = options[el];
      } else {
        errors[el] = [`${el} is not product property`];
      }
    });
    if (JSON.stringify(errors) !== '{}') {
      return res.status(400).json(errors);
    }
    errors = validate(req.body, option);
    if (errors) {
      return res.status(422).json(errors);
    }
  }
  let categories;
  if (req.body.category) {
    if (req.body.category instanceof Array) {
      categories = { $each: req.body.category };
    } else {
      categories = req.body.category;
    }
    delete req.body.category;
  }
  const images = [];
  if (req.files) {
    req.files.forEach((el) => {
      images.push(el.filename);
    });
  }
  const update = {};
  if (categories) {
    update.$addToSet = { categories };
  }
  if (images.length) {
    update.$addToSet.images = images;
  }
  update.$set = req.body;
  const query = { _id: req.params.id };
  return ProductDAO.update(query, update)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.deleteProduct = (req, res) => {
  ProductDAO.remove({ _id: req.params.id })
    .then(data => res.json(data))
    .catch(err => res.json(err));
};
