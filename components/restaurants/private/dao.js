const BaseDAO = require('../../core/base-dao');
const RestaurantSchema = require('./model');

class RestaurantsDAO extends BaseDAO {
  constructor() {
    super('Restaurants', RestaurantSchema);
  }

  getRestaurant(query) {
    return this.model.findOne(query)
      .populate('products')
      .select({
        __v: 0,
      })
      .exec();
  }
}

module.exports = new RestaurantsDAO();
