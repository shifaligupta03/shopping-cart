const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');

// router.get('/', async(req, res) => {
//     let page = await Page.findOne({slug:'home'});
//     res.render('index',{title:page.title, content: page.content});
// });


module.exports = router;