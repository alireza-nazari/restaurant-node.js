const RestaurantDAO = require('../components/restaurants/private/dao');
const TableDAO = require('../components/tables/private/dao');
const ProductDAO = require('../components/products/private/dao');

const restaurantData = require('./data/restaurants');
const tablesData = require('./data/tables');
const productsData = require('./data/products');

(async function init() {
  try {
    const products = await ProductDAO.insertMany(productsData);
    restaurantData.forEach((restaurant) => {
      products.forEach((product) => {
        restaurant.products.push(product._id);
      });
    });
    const restaurants = await RestaurantDAO.insertMany(restaurantData);
    tablesData.forEach((table, i) => {
      table.restaurantId = restaurants[i % 4]._id;
    });
    await TableDAO.insertMany(tablesData);
    console.log('data created !!!');
  } catch (e) {
    console.log(e);
  }
  process.exit();
}());
