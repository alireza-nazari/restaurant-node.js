const validate = require('validate.js');
const moment = require('moment');

const TablesDAO = require('./private/dao');
const reservation = require('../reservation/service');
const {
  tableConstrains,
  timeConstrains,
} = require('./private/validateOptions');

exports.createTable = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, tableConstrains);
  if (errors) {
    return res.status(422).json({ errors });
  }
  try {
    const table = await TablesDAO.insert(req.body);
    return res.json(table);
  } catch (e) {
    return next(e);
  }
};

function findFreeTable(reserv, startTime, endTime) {
  let i = 0;
  while (i < reserv.length) {
    if (moment(startTime).isSame(reserv[i].startTime)
    || moment(endTime).isSame(reserv[i].endTime)) {
      break;
    }
    const start = moment(startTime, 'YYYY-MM-DD HH:mm', true).isBetween(reserv[i].startTime, reserv[i].endTime, 'minute');
    const end = moment(endTime, 'YYYY-MM-DD HH:mm').isBetween(reserv[i].startTime, reserv[i].endTime, 'minute');
    if (start || end) {
      break;
    }
    i += 1;
  }
  return i === reserv.length;
}

function addReservationId(_id, reservationId) {
  const update = {
    $addToSet: {
      reservations: reservationId,
    },
  };
  return TablesDAO.update({ _id }, update);
}

exports.Reservation = async (req, res, next) => {
  if (JSON.stringify(req.body) === '{}') {
    return res.status(400).json({ message: 'Body required' });
  }
  const errors = validate(req.body, timeConstrains);
  if (errors) {
    return res.status(422).json({ errors });
  }
  try {
    const tables = await TablesDAO.fetchMany({ restaurantId: req.body.restaurantId });
    if (!tables.length) {
      return res.status(401).json({ message: 'there are no tables in the restaurant' });
    }
    const freeTable = tables
      .filter(table => findFreeTable(table.reservations, req.body.startTime, req.body.endTime));
    if (!freeTable.length) {
      if (req.query.check) {
        return res.json({
          data: [
            {
              startTime: { hour: 11, minute: 15 },
              endTime: { hour: 15, minute: 5 },
            },
          ],
        });
      }
      return res.status(401).json({ message: 'at this time all the tables are reserved' });
    }
    if (req.query.check) {
      return res.json({ data: [] });
    }
    const { _id: tableId } = freeTable[0];
    req.body.tableId = tableId;
    const bookedTable = await reservation.booking(req.body);
    await addReservationId(tableId, bookedTable._id);
    ['__v', '_id'].forEach(e => delete bookedTable[e]);
    return res.json(bookedTable);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.getAllTables = async (req, res, next) => {
  try {
    const tables = await TablesDAO.fetchMany();
    return res.json(tables);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};

exports.deleteTable = async (req, res, next) => {
  try {
    const data = await TablesDAO.remove({ _id: req.params.id });
    return res.json(data);
  } catch (e) {
    console.log(e);
    return next(e);
  }
};
