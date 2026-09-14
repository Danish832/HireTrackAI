const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) {
      res.status(401);
      throw new Error('Not authorized, no access token');
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    next(new Error('Not authorized, token invalid or expired'));
  }
};

module.exports = { protect };