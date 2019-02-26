const validate = require('validate.js');

const options = require('./private/validateOptions');
const UserDAO = require('./private/dao');
const { updateToken } = require('../token/authToken');
const TokenDAO = require('../token/private/dao');

exports.createUsers = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, options);
  if (errors) {
    return res.status(422).json(errors);
  }
  const { email } = req.body;
  return UserDAO.fetchOne({ email })
    .then((user) => {
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
      return UserDAO.insert(req.body)
        .then(fullUser => ({
          _id: fullUser._id,
          name: fullUser.name,
          surname: fullUser.surname,
          age: fullUser.age,
          email: fullUser.email,
          address: fullUser.address,
          image: fullUser.image,
        }))
        .then(cratedUser => updateToken(cratedUser._id)
          .then(tokens => ({ user: cratedUser, tokens }))
          .then(data => res.json(data)))
        .catch(err => res.json(err));
    })
    .catch(err => res.status(444).json(err));
};

exports.getUsers = (req, res) => {
  const { limit, offset } = req;
  UserDAO.fetchMany({}, { limit, offset })
    .then(users => users.map((user) => {
      user.image = `images/users/${user.image}`;
      return user;
    }))
    .then((users) => {
      res.json(users);
    })
    .catch((err) => {
      res.json(err);
    });
};

exports.getOneUser = (req, res) => {
  if (req.user) {
    req.user.image = `images/users/${req.user.image}`;
    return res.json(req.user);
  }
  return UserDAO.getOne({ _id: req.params.id })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ message: 'no such user' });
      }
      user.image = `images/users/${user.image}`;
      return res.json(user);
    })
    .catch(err => res.json(err));
};

exports.login = (req, res) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const { email, password } = req.body;
  const { email: option } = options;
  const errors = validate({ email }, { email: option });
  if (errors) {
    return res.status(422).json({ errors });
  }
  return UserDAO.fetchOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ email: 'such user not found' });
      }
      if (!user.checkPassword(password)) {
        return res.status(422).json({ password: 'wrong password' });
      }
      return {
        _id: user._id,
        name: user.name,
        surname: user.surname,
        age: user.age,
        email: user.email,
        address: user.address,
        image: user.image,
      };
    })
    .then(user => updateToken(user._id)
      .then(tokens => res.json({ tokens, user })))
    .catch(err => res.json(err));
};

exports.updateUsers = (req, res) => {
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
  return UserDAO.update({ _id: req.params.id }, update)
    .then(data => res.json(data))
    .catch(err => res.json(err));
};

exports.removeUsers = (req, res) => {
  UserDAO.remove({ _id: req.params.id })
    .then((data) => {
      TokenDAO.removeToken({ userId: req.params.id })
        .then(token => console.log(token))
        .catch(err => console.log(err));
      return res.json(data);
    })
    .catch(err => res.json(err));
};
