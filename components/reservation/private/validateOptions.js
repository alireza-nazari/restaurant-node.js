const validate = require('validate.js');
const { ObjectId } = require('mongoose').Types;
const moment = require('moment');

const msg = require('../../../messages');

const namePattern = /^[A-Za-z\-' ']+$/;
const phonePattern = /((\(\d{3}\) ?)|(\d{2}-))?\d{3}-\d{2}-\d{2}-\d{2}$/;

validate.validators.ObjectId = value => (ObjectId.isValid(value) ? null : 'is not a ObjectId');
validate.extend(validate.validators.datetime, {
  parse(value) {
    return +moment.utc(value);
  },
  format(value, options) {
    const format = options.dateOnly ? 'YYYY-MM-DD' : 'YYYY-MM-DD hh:mm:ss';
    return moment.utc(value).format(format);
  },
});

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
  date: {
    presence: { message: msg('required') },
    datetime: {
      dateOnly: true,
      earliest: true,
    },
  },
  startTime: {
    presence: { message: msg('required') },
  },
  'startTime.hour': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
  'startTime.minute': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
  endTime: {
    presence: { message: msg('required') },
  },
  'endTime.hour': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
  'endTime.minute': {
    presence: { message: msg('required') },
    numericality: {
      onlyInteger: true,
    },
  },
};

module.exports = bookingConstrains;
