exports.equalById = (req, res, next) => {
  if (req.user._id !== req.params.id && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'permission denied' });
  }
  return next();
};
