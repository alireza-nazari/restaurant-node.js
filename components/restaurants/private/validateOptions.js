const msg = require('../../../messages');

const restaurantsConstrains = {
  name: {
    presence: { message: msg('required') },
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  type: {
    presence: { message: msg('required') },
  },
  description: {
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
  tel: {
    presence: { message: msg('required') },
  },
  city: {
    presence: { message: msg('required') },
  },
  country: {
    presence: { message: msg('required') },
  },
  avatar: {},
};

module.exports = restaurantsConstrains;
