const productConstrains = {
  name: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 30,
    },
  },
  description: {
    presence: true,
    length: {
      minimum: 2,
      maximum: 200,
    },
  },
  category: {
    presence: true,
  },
  price: {
    presence: true,
  },
};

module.exports = productConstrains;
