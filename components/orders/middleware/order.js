const OrderDAO = require('../private/dao');

exports.equalById = (req, res, next) => OrderDAO.fetchOne({ _id: req.params.id })
  .then((order) => {
    if (!order) {
      return res.status(400).json({ message: 'no such order' });
    }
    if (!req.user._id.equals(order.userId) && (req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'permission denied' });
    }
    req.order = order;
    return next();
  })
  .catch(err => res.json(err));
