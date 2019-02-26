const jwt = require('jsonwebtoken');

const TokenDAO = require('./private/dao');
const { updateToken } = require('./authToken');
const { secret, tokens } = require('../../config')('jwt');

exports.refreshTokens = (req, res) => {
  if (!req.body.refreshToken) {
    return res.status(400).json({
      errors: {
        refreshToken: ['refreshToken can\'t be blank'],
      },
    });
  }
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== tokens.refresh.type) {
      return res.status(400).json({ message: 'invalid token!' });
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'RefreshToken expired!' });
    }
    return res.status(401).json({ message: 'Invalid refreshToken!' });
  }
  return TokenDAO.fetchOne({ tokenId: payload.id })
    .then((token) => {
      if (token === null) {
        throw new Error('invalid token');
      }
      return updateToken(token.userId);
    })
    .then(token => res.json(token))
    .catch(err => res.json(err));
};
