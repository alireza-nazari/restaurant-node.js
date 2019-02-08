const mongoose = require('mongoose');

const db = require('../../config/index')('db');

mongoose.Promise = Promise;

mongoose.connect(`mongodb://${db.host}:${db.port}/${db.dbName}`, { useNewUrlParser: true, useCreateIndex: true });

module.exports = mongoose;
