const { check, validationResult } = require('express-validator/check');

async function validateProducts(req, res, next) {

  const errors = await validationResult(req);
  const id= (req.params.id) ? req.params.id : ''
  const requestBody =  {...req.body, errors: errors.array(), id};
  
  if (!errors.isEmpty()) {
    if(id){
        req.session.errors = errors;
        res.redirect('/admin/products/edit-product/'+id);
    }else{
      return res.render('admin/add_product', requestBody);
    }
  }
  next();
}

module.exports = validateProducts;


