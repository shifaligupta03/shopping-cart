const { check, validationResult } = require('express-validator/check');

async function validateCategories(req, res, next) {
  const errors = await validationResult(req);
  const title = req.body.title;

  if (!errors.isEmpty()) {
    return res.render('admin/add_category', { errors: errors.array(), title });
  }
  next();
}

module.exports = validateCategories;


