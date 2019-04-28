const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const {Product, validateProduct} = require('../models/product');
const {category, validateCategory} = require('../models/category');



router.get('/', async(req, res)=>{
    const products = await Product.find();
    const count = products.length;
    return res.render('admin/products',{products, count});
});

router.get('/add-product', async(req, res) =>{
    const title ="";
    const desc ="";
    const price=""; 
    const id="";
    const categories = await category.find();
    // console.log(categories);
    // [...categories].forEach(function(cat){
    //     console.log(cat.slug);
    // })

    // return res.send({
    //     title, desc, price, categories, id
    //  });

    return res.render('admin/add_product',{
       title, desc, price, categories, id
    });
});


module.exports = router;