const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const {Product, validateProduct} = require('../models/product');
const {category, validateCategory} = require('../models/category');
const validateProductBody = require('../middleware/adminProduct');


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
    return res.render('admin/add_product',{
       title, desc, price, categories, id
    });
});

router.post('/add-product', validateProduct, validateProductBody, async (req, res) => {
    const title = req.body.title;
    const slug = title.replace(/ /g, '-').toLowerCase();
    const desc = req.body.desc;
    const price= req.body.price; 
    const category= req.body.category;
    console.log(req.body);
    let product = await Product.findOne({ slug });
    if (product) {
        req.flash('danger', 'Title already exists. Please choose another.');
        return res.render('admin/add_product', {...req.body});
    }

    const price2 = parseFloat(price).toFixed(2);
    let imageFile= (req.files && req.files.image && typeof(req.files.image.name) !== 'undefined') ? req.files.image.name : null;
    product = new Product({title, desc, price: price2, category, image: imageFile});
    product = await product.save();
    await mkdirp('public/product_images'+product._id);
    await mkdirp('public/product_images'+product._id+'/gallery');
    await mkdirp('public/product_images'+product._id+'/gallery/thumbs');
    if(imageFile !== ''){
        const productImage = req.files.image;
        const imgPath = 'public/product_images/'+product._id+'/'+imageFile;
        await productImage.mv(imgPath);
    }
    req.flash('success', 'Product added.');
    return res.redirect('admin/pages');
});



module.exports = router;