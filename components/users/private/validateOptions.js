const msg = require('../../../messages');

const userConstrains = {
  name: {
    presence: { message: msg('required') },
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  surname: {
    presence: { message: msg('required') },
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  age: {
    presence: { message: msg('required') },
  },
  email: {
    presence: { message: msg('required') },
    email: { message: msg('email') },
    length: {
      minimum: 9,
      maximum: 65,
    },
  },
  password: {
    presence: { message: msg('required') },
    length: {
      minimum: 6,
      maximum: 50,
      tooShort: 'needs to have %{count} words or more',
      tooLong: 'needs to have %{count} words or less',
    },
  },
  confirmPassword: {
    presence: { message: msg('required') },
    equality: 'password',
  },
  city: {
    presence: { message: msg('required') },
  },
  country: {
    presence: { message: msg('required') },
  },
  image: {},
};

module.exports = userConstrains;
