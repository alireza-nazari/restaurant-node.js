const validate = require('validate.js');

const options = require('./private/validateOptions');
const ProductDAO = require('./private/dao');

exports.getProducts = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const products = await ProductDAO.fetchMany({}, { limit, offset });
    res.json(products);
  } catch (e) {
    next(e);
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const product = await ProductDAO.fetchOne({ _id: req.params.id });
    if (!product) {
      return res.status(400).json({ message: 'no such product' });
    }
    return res.json(product);
  } catch (e) {
    return next(e);
  }
};

exports.createProduct = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}' && !req.file) {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json({ errors });
  }
  if (req.file) {
    req.body.image = req.file.filename;
  }
  req.body.categories = req.body.category;
  try {
    const product = await ProductDAO.insert(req.body);
    return res.json(product);
  } catch (e) {
    return next(e);
  }
};

exports.updateProduct = async (req, res, next) => {
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
      return res.status(400).json({ errors });
    }
    errors = validate(req.body, option);
    if (errors) {
      return res.status(422).json({ errors });
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
  try {
    const updatedData = await ProductDAO.update(query, update);
    return res.json(updatedData);
  } catch (e) {
    return next(e);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const deletedData = await ProductDAO.remove({ _id: req.params.id });
    res.json(deletedData);
  } catch (e) {
    next(e);
  }
};

exports.removeAll = async (req, res, next) => {
  try {
    const data = await ProductDAO.removeAll();
    res.json(data);
  } catch (e) {
    next(e);
  }
};
