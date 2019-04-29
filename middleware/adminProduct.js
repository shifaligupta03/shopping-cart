const { check, validationResult } = require('express-validator/check');

async function validateProducts(resq, res, next) {
  const errors = await validationResult(req);
  const title = req.body.title;

  if (!errors.isEmpty()) {
    return res.render('admin/add_product', { errors: errors.array(), title });
  }
  next();
}

module.exports = validateProducts;


