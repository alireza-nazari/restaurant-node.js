const express = require('express');

const tables = require('./service');
const Auth = require('../../middleware/auth');

const tablesRouter = express.Router();

tablesRouter.get('/all', Auth.authorizeRequest('admin'), tables.getAllTables);
tablesRouter.delete('/', Auth.authorizeRequest('admin'), tables.removeAll);
tablesRouter.delete('/:id', Auth.authorizeRequest('user'), tables.deleteTable);
tablesRouter.post('/', Auth.authorizeRequest('admin'), tables.createTable);
tablesRouter.post('/reservation', Auth.authorizeRequest('user'), tables.Reservation);

module.exports = tablesRouter;
