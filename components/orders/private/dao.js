const BaseDAO = require('../../core/base-dao');
const OrdersSchema = require('./model');

class OrdersDAO extends BaseDAO {
  constructor() {
    super('Orders', OrdersSchema);
  }
}

module.exports = new OrdersDAO();
