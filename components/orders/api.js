const express = require('express');

const orders = require('./service');
const Auth = require('../../middleware/auth');
const { equalById } = require('./middleware/order');

const orderRouter = express.Router();

orderRouter.get('/all', Auth.authorizeRequest('admin'), orders.getOrders);
orderRouter.use(Auth.authorizeRequest());
orderRouter.post('/', orders.createOrder);
orderRouter.post('/:id/products/', orders.addProduct);
orderRouter.get('/', orders.getOrdersByUserId);
orderRouter.get('/:id', equalById, orders.getOneOrder);
orderRouter.put('/:id', equalById, orders.updateOrder);
orderRouter.delete('/:id', equalById, orders.deleteOrder);
orderRouter.delete('/:id/products/:prod_id', equalById, orders.deleteProducts);

module.exports = orderRouter;
