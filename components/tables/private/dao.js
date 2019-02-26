const BaseDAO = require('../../core/base-dao');
const TableSchema = require('./model');

class TablesDAO extends BaseDAO {
  constructor() {
    super('Tables', TableSchema);
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
