const express = require('express');
const multer = require('multer');

const restaurants = require('./service');
const Auth = require('../../middleware/auth');

const restaurantsRouter = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/images/restaurants');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

restaurantsRouter.post('/', upload.single('avatar'), Auth.authorizeRequest('admin'), restaurants.createRestaurants);
restaurantsRouter.get('/', Auth.authorizeRequest('user'), restaurants.getRestaurants);
restaurantsRouter.get('/:id', Auth.authorizeRequest('user'), restaurants.getRestaurantsById);
// restaurantsRouter.put('/:id', Auth.authorizeRequest('admin'), restaurants.updateById);

restaurantsRouter.delete('/:id', Auth.authorizeRequest('admin'), restaurants.deleteRestaurnt);

restaurantsRouter.post('/:id/products', Auth.authorizeRequest('admin'), restaurants.addProducts);
restaurantsRouter.delete('/:id/products/:prod_id', Auth.authorizeRequest('admin'), restaurants.deleteProduct);


module.exports = restaurantsRouter;
