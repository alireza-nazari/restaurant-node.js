exports.OrderConstrains = {
  userId: {
    presence: true,
  },
  method: {
    presence: true,
    inclusion: ['visa', 'cash'],
  },
  transactionId: {
    presence: true,
  },
  address: {
    presence: true,
  },
  products: {
    presence: true,
  },
};

exports.orderProducts = {
  productId: {
    presence: true,
  },
  quantity: {
    presence: true,
    numericality: {
      onlyInteger: true,
    },
  },
};
