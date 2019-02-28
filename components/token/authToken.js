const authHelper = require('./helper/authHelper');


// TODO sarkel asinxron tech kanflict kuda
exports.updateToken = async (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();
  try {
    await authHelper.replaceDbRefreshToken(refreshToken.id, userId);
    return { accessToken, refreshToken: refreshToken.token };
  } catch (e) {
    return e;
  }
};
