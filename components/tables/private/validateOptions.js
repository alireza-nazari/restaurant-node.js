const moment = require('moment');
const validate = require('validate.js');
const { ObjectId } = require('mongoose').Types;

const msg = require('../../../messages');

validate.validators.ObjectId = value => (ObjectId.isValid(value) ? null : 'is not a ObjectId');
validate.validators.datetime = (value) => {
  const d = moment(value, 'YYYY-MM-DD HH:mm', true).isValid()
    ? null
    : 'format should be \'YYYY-MM-DD HH:mm\'';
  return d;
};

const tableConstrains = {
  number: {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
  restaurantId: {
    presence: { message: msg('required') },
    ObjectId: true,
  },
  price: {
    presence: { message: msg('required') },
    numericality: true,
  },
};

const timeConstrains = {
  startTime: {
    presence: { message: msg('required') },
    datetime: true,
  },
  endTime: {
    presence: { message: msg('required') },
    datetime: true,
  },
  restaurantId: {
    presence: { message: msg('required') },
    ObjectId: true,
  },
};

module.exports = { tableConstrains, timeConstrains };
