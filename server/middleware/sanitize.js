const mongoSanitize = require('express-mongo-sanitize');

const sanitizeBody = (req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  // req.query intentionally skipped — read-only in Express 5
  next();
};

module.exports = sanitizeBody;