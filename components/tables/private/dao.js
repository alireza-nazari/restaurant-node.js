const BaseDAO = require('../../core/base-dao');
const TableSchema = require('./model');

class TablesDAO extends BaseDAO {
  constructor() {
    super('Tables', TableSchema);
  }

  getTables({ restaurantId }) {
    return this.model.find({ restaurantId })
      .populate('reservations')
      .map((tables) => {
        if (!tables.length) {
          return tables;
        }
        return tables.map((table) => {
          table.reservations.map((reserv) => {
            const startTime = `${reserv.startTime.hour}${reserv.startTime.minute}`;
            const endTime = `${reserv.endTime.hour}${reserv.endTime.minute}`;
            reserv.startTime.time = startTime;
            reserv.endTime.time = endTime;
            console.log(reserv);
            return reserv;
          });
          return table;
        });
      })
      .exec();
  }

  fetchMany(query = {}, options = {}) {
    return this.model.find(query)
      .populate('reservations')
      .skip(options.offset)
      .limit(options.limit)
      .sort(options.sort || {});
  }
}

module.exports = new TablesDAO();
