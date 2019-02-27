const express = require('express');

const reservation = require('./service');
const Auth = require('../../middleware/auth');

const reservationRouter = express.Router();

reservationRouter.get('/', Auth.authorizeRequest('admin'), reservation.getReservations);
reservationRouter.delete('/', Auth.authorizeRequest('admin'), reservation.removeAll);
reservationRouter.delete('/:id', Auth.authorizeRequest('admin'), reservation.deleteReservations);

module.exports = reservationRouter;
