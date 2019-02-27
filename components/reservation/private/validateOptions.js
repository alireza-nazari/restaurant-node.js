const validate = require('validate.js');
const { ObjectId } = require('mongoose').Types;
const moment = require('moment');

const msg = require('../../../messages');

const namePattern = /^[A-Za-z\-' ']+$/;
const phonePattern = /((\(\d{3}\) ?)|(\d{2}-))?\d{3}-\d{2}-\d{2}-\d{2}$/;

validate.validators.ObjectId = value => (ObjectId.isValid(value) ? null : 'is not a ObjectId');
validate.validators.datetime = (value) => {
  const d = moment(value, 'YYYY-MM-DD HH:mm', true).isValid()
    ? null
    : 'format should be \'YYYY-MM-DD HH:mm\'';
  return d;
};

const bookingConstrains = {
  tableId: {
    ObjectId: true,
    presence: { message: msg('required') },
  },
  name: {
    presence: { message: msg('required') },
    format: namePattern,
  },
  surname: {
    format: namePattern,
  },
  email: {
    presence: { message: msg('required') },
    email: { message: msg('email') },
    length: {
      minimum: 9,
      maximum: 65,
    },
  },
  phone: {
    presence: { message: msg('required') },
    format: phonePattern,
  },
  occasions: {
    inclusion: ['birthday', 'anniversary', 'date-night', 'business-meal', 'celebration'],
  },
  guestsCount: {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
  startTime: {
    presence: { message: msg('required') },
    datetime: {
      earliest: true,
    },
  },
  endTime: {
    presence: { message: msg('required') },
    datetime: {
      earliest: true,
    },
  },
};

module.exports = bookingConstrains;
