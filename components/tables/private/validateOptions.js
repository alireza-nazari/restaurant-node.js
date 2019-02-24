const validate = require('validate.js');
const { ObjectId } = require('mongoose').Types;

const msg = require('../../../messages');

validate.validators.ObjectId = value => (ObjectId.isValid(value) ? null : 'is not a ObjectId');
validate.validators.char = value => (value.toString().length === 2 ? null : 'must be 2 characters');

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
  },
  'startTime.hour': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
    char: true,
  },
  'startTime.minute': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
    char: true,
  },
  endTime: {
    presence: { message: msg('required') },
  },
  'endTime.hour': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
    char: true,
  },
  'endTime.minute': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
    char: true,
  },
  restaurantId: {
    presence: { message: msg('required') },
    ObjectId: true,
  },
};

module.exports = { tableConstrains, timeConstrains };
