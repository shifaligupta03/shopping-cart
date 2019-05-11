const pages = require('../routes/pages');
const adminPages = require('../routes/admin_pages');
const adminCategories = require('../routes/admin_categories');
const adminProducts = require('../routes/admin_products');
const products = require('../routes/products');

module.exports = function (app){
    app.use('/admin/pages', adminPages);
    app.use('/admin/categories', adminCategories);
    app.use('/admin/products', adminProducts);
    app.use('/products', products);
    app.use('/', pages);
}