const validate = require('validate.js');

const UserDAO = require('./private/dao');
const TokenDAO = require('../token/private/dao');
const options = require('./private/validateOptions');
const { updateToken } = require('../token/authToken');

exports.createUsers = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json({ errors });
  }
  try {
    const user = await UserDAO.fetchOne({ email: req.body.email });
    if (user) {
      return res.status(401).json({ email: 'user is registered, please enter other email' });
    }
    req.body.address = {
      country: req.body.country,
      city: req.body.city,
    };
    if (req.file) {
      req.body.image = req.file.filename;
    }
    const insertedUser = await UserDAO.insert(req.body);
    const { _id, name, surname, age, email, address, image } = insertedUser;
    const cratedUser = { _id, name, surname, age, email, address, image };
    const tokens = await updateToken(_id);
    return res.json({ user: cratedUser, tokens });
  } catch (e) {
    return next(e);
  }
};

exports.getUsers = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const users = await UserDAO.fetchMany({}, { limit, offset });
    const newUsers = users.map((user) => {
      user.image = `images/users/${user.image}`;
      return user;
    });
    res.json(newUsers);
  } catch (e) {
    next(e);
  }
};

exports.getOneUser = async (req, res, next) => {
  if (req.user) {
    req.user.image = `images/users/${req.user.image}`;
    return res.json(req.user);
  }
  try {
    const user = await UserDAO.fetchOne({ _id: req.params.id });
    if (!user) {
      return res.status(400).json({ message: 'no such user' });
    }
    user.image = `images/users/${user.image}`;
    return res.json(user);
  } catch (e) {
    return next(e);
  }
};

exports.login = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const { email: option } = options;
  const errors = validate({ email: req.body.email }, { email: option });
  if (errors) {
    return res.status(422).json({ errors });
  }
  try {
    const user = await UserDAO.fetchOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ email: 'such user not found' });
    }
    if (!user.checkPassword(req.body.password)) {
      return res.status(422).json({ password: 'wrong password' });
    }
    const { _id, name, surname, age, email, address, image } = user;
    const tokens = await updateToken(_id);
    const newUser = { _id, name, surname, age, email, address, image };
    return res.json({ tokens, user: newUser });
  } catch (e) {
    return next(e);
  }
};

exports.updateUsers = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  if ('role' in req.body && req.user.role !== 'admin') {
    return res.status(406).json({ message: 'permission denied, role is invariable' });
  }
  const option = {};
  let errors = {};
  Object.keys(req.body).forEach((el) => {
    if (el in options) {
      option[el] = options[el];
    } else {
      errors[el] = [`${el} is not user property`];
    }
  });
  if (JSON.stringify(errors) !== '{}') {
    return res.status(400).json({ errors });
  }
  errors = validate(req.body, option);
  if (errors) {
    return res.status(422).json({ errors });
  }
  if ('password' in req.body) {
    req.user.password = req.body.password;
    req.body.salt = req.user.salt;
    req.body.iteration = req.user.iteration;
    req.body.hash = req.user.hash;
  }
  const update = {
    $set: req.body,
  };
  try {
    const updateData = UserDAO.update({ _id: req.params.id }, update);
    return res.json(updateData);
  } catch (e) {
    return next(e);
  }
};

exports.removeUsers = async (req, res, next) => {
  try {
    const deletedData = await UserDAO.remove({ _id: req.params.id });
    await TokenDAO.removeToken({ userId: req.params.id });
    return res.json(deletedData);
  } catch (e) {
    return next(e);
  }
};
