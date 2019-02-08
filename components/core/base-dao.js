const DBConnection = require('./db_connect');

class BaseDAO {
  constructor(collection, schema) {
    this.model = DBConnection.model(collection, schema);
  }

  fetchMany(query = {}, options = {}) {
    return this.model.find(query)
      .limit(options.limit)
      .skip(options.offset)
      .sort(options.sort || {})
      .exec();
  }

  fetchOne(query = {}) {
    return this.model.findOne(query);
  }

  insert(obj) {
    return this.model.create(obj);
  }

  update(query, update) {
    return this.model.updateOne(query, update);
  }

  remove(query) {
    return this.model.remove(query);
  }
}

module.exports = BaseDAO;
