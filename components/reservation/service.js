const validate = require('validate.js');

const options = require('./private/validateOptions');
const ReservationDAO = require('./private/dao');

exports.booking = data => new Promise(async (resolve, reject) => {
  const errors = validate(data, options);
  if (errors) {
    const error = {
      status: 422,
      message: errors,
    };
    return reject(error);
  }
  try {
    const bookedTable = await ReservationDAO.insert(data);
    return resolve(bookedTable);
  } catch (e) {
    return reject(e);
  }
});

exports.getReservations = async (req, res, next) => {
  const { limit, offset } = req;
  try {
    const reservations = await ReservationDAO.fetchMany({}, { limit, offset });
    return res.json(reservations);
  } catch (e) {
    return next(e);
  }
};

exports.deleteReservations = async (req, res, next) => {
  try {
    const data = await ReservationDAO.remove({ _id: req.params.id });
    return res.json(data);
  } catch (e) {
    return next(e);
  }
};
