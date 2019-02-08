const conf = require('../config')('query');

class RequestService {
  static parseQuery(req, res, next) {
    const limit = parseInt(req.query.limit, 10);
    req.limit = (limit > conf.limit_min && limit < conf.limit_max)
      ? limit : conf.limit_default;

    const offset = parseInt(req.query.offset, 10);
    req.offset = (offset > conf.offset_min)
      ? offset : conf.offset_default;
    next();
  }
}

module.exports = RequestService;
