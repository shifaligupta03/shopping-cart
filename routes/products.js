const express = require('express');
const router = express.Router();
const config = require('config');
const {Product} = require('../models/product');
const fs = require('fs-extra');

router.get('/', async(req, res) => {
    let products = await Product.find();
    res.render('products',{title:'Products', products});
});

router.get('/:category', async(req, res) => {
    let category = req.params.category;
    let products = await Product.find({category});
    res.render('products',{title:'Products', products});
});

router.get('/:category/:product', async(req, res) => {
    let slug = req.params.product;
    let product = await Product.findOne({slug});
    let productImagesPath = config.get('product_images_path');
    let galleryDir = productImagesPath+'/'+product._id+'/gallery/';
    let galleryImages = await fs.readdir(galleryDir);
    res.render('product_detail',{title:product.title, product, galleryImages });
});

module.exports = router;