const validate = require('validate.js');

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
    return res.status(422).json(errors);
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
    const start = `${reserv[i].startTime.hour}${reserv[i].startTime.minute}`;
    const end = `${reserv[i].endTime.hour}${reserv[i].endTime.minute}`;
    if ((startTime >= start && startTime < end)
    || (endTime <= end && endTime > start)) {
      break;
    }
    i += 1;
  }
  if (i === reserv.length) {
    return true;
  }
  return false;
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
    return res.status(422).json(errors);
  }
  const startTime = `${req.body.startTime.hour}${req.body.startTime.minute}`;
  const endTime = `${req.body.endTime.hour}${req.body.endTime.minute}`;
  try {
    const tables = await TablesDAO.fetchMany({ restaurantId: req.body.restaurantId });
    if (!tables.length) {
      return res.status(401).json({ message: 'there are no tables in the restaurant' });
    }
    const freeTable = tables.filter(table => findFreeTable(table.reservations, startTime, endTime));
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
      return res.status(401).json({ message: 'no free table' });
    }
    if (req.query.check) {
      return res.json({ data: [] });
    }
    const { _id: tableId } = freeTable[0];
    req.body.tableId = tableId;
    const bookedTable = await reservation.booking(req.body);
    await addReservationId(tableId, bookedTable._id);
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
