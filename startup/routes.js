const pages = require('../routes/pages');
const adminPages = require('../routes/admin_pages');
const adminCategories = require('../routes/admin_categories');

module.exports = function (app){
    app.use('/admin/pages', adminPages);
    app.use('/admin/categories', adminCategories);
    app.use('/', pages);
}