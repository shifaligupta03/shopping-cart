const { check, validationResult } = require('express-validator/check');

async function validateProducts(req, res, next) {

  const errors = await validationResult(req);
  const requestBody =  {...req.body, errors: errors.array(), id:''};
  
  if (!errors.isEmpty()) {
    return res.render('admin/add_product', requestBody);
  }
  next();
}

module.exports = validateProducts;


