const BaseDAO = require('../../core/base-dao');
const ProductsSchema = require('./model');

class ProductsDAO extends BaseDAO {
  constructor() {
    super('Products', ProductsSchema);
  }
}

module.exports = new ProductsDAO();
