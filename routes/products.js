const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');

router.get('/', async(req, res) => {
    let products = await Product.find();
    res.render('products',{title:'Products', products});
});

module.exports = router;