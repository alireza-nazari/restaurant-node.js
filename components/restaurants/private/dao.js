const BaseDAO = require('../../core/base-dao');
const ResturantSchema = require('./model');

class ResturantsDAO extends BaseDAO {
  constructor() {
    super('Restaurants', ResturantSchema);
  }
}

module.exports = new ResturantsDAO();
