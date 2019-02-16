const jwt = require('jsonwebtoken');
const uuid = require('uuid/v4');

const TokenDAO = require('../private/dao');
const { secret, tokens } = require('../../../config')('jwt');

module.exports.generateAccessToken = (userId) => {
  const payload = {
    userId,
    type: tokens.access.type,
  };
  const options = { expiresIn: tokens.access.expiresIn };

  return jwt.sign(payload, secret, options);
};

module.exports.generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: tokens.refresh.type,
  };
  const options = { expiresIn: tokens.refresh.expiresIn };

  return {
    id: payload.id,
    token: jwt.sign(payload, secret, options),
  };
};

module.exports.replaceDbRefreshToken = (tokenId, userId) => TokenDAO.removeToken({ userId })
  .exec()
  .then(() => TokenDAO.insert({ tokenId, userId }));
