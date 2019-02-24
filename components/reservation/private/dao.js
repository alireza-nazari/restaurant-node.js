const BaseDAO = require('../../core/base-dao');
const ReservationSchema = require('./model');

class ReservationDAO extends BaseDAO {
  constructor() {
    super('Reservation', ReservationSchema);
  }
}

module.exports = new ReservationDAO();
