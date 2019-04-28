const { check, validationResult } = require('express-validator/check');

async function validatePages(req, res, next) {
  const errors = await validationResult(req);
  const title = req.body.title;
  const content = req.body.content;
  let slug = req.body.slug.replace(/\s+/g, '-').toLowerCase();
  if (slug == "") slug = title.replace(/\s+/g, '-').toLowerCase();

  if (!errors.isEmpty()) {
    return res.render('admin/add_page', { errors: errors.array(), title, slug, content });
  }
  next();
}

module.exports = validatePages;


