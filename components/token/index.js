const tokenRouter = require('./api');
const TokenDAO = require('./private/dao');
const { updateToken } = require('./authToken');

module.exports = {
  tokenRouter,
  TokenDAO,
  updateToken,
};
