const { check, validationResult } = require('express-validator/check');

async function validateUser(req, res, next) {
  const errors = await validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/add_page', { errors: errors.array(), ...req.body });
  }
  next();
}

module.exports = validateUser;


