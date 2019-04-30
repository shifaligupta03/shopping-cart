const { check, validationResult } = require('express-validator/check');

async function validateProducts(req, res, next) {

  
  // console.log(imageFile);
  // check('image', 'You must upload an image').isImage(imageFile);
 

  const errors = await validationResult(req);
  const requestBody =  {...req.body, errors: errors.array(), id:'', categories: ['food']};
  
  if (!errors.isEmpty()) {
    return res.render('admin/add_product', requestBody);
  }
  next();
}

module.exports = validateProducts;


