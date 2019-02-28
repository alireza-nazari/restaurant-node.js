const jwt = require('jsonwebtoken');

const TokenDAO = require('./private/dao');
const { updateToken } = require('./authToken');
const { secret, tokens } = require('../../config')('jwt');

exports.refreshTokens = async (req, res, next) => {
  if (!req.body.refreshToken) {
    return res.status(400).json({
      errors: {
        refreshToken: ['refreshToken can\'t be blank'],
      },
    });
  }
  let payload;
  try {
    payload = jwt.verify(req.body.refreshToken, secret);
    if (payload.type !== tokens.refresh.type) {
      return res.status(400).json({ message: 'invalid token!' });
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'RefreshToken expired!' });
    }
    return res.status(401).json({ message: 'Invalid refreshToken!' });
  }
  try {
    const token = await TokenDAO.fetchOne({ tokenId: payload.id });
    if (token === null) {
      return next({ message: 'invalid token', status: 401 });
    }
    const updatedToken = await updateToken(token.userId);
    return res.json(updatedToken);
  } catch (e) {
    return next(e);
  }
};
