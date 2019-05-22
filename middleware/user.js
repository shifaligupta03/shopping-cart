const { check, validationResult } = require('express-validator/check');

async function validateUser(req, res, next) {
  const errors = await validationResult(req);
  console.log(req.body.password , req.body.password2);
  console.log(errors.array({ onlyFirstError: true }));
  if (!errors.isEmpty()) {
    return res.render('register', { errors: errors.array({ onlyFirstError: true }), ...req.body });
  }
  next();
}

module.exports = validateUser;


