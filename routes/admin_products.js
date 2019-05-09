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
    let product = await Product.findOne({ slug });
    if (product) {
        req.flash('danger', 'Title already exists. Please choose another.');
        return res.render('admin/add_product', {...req.body, id:''});
    }

    const price2 = parseFloat(price).toFixed(2);
    let imageFile= (req.files && req.files.image && typeof(req.files.image.name) !== 'undefined') ? req.files.image.name : null;
    product = new Product({title, desc, slug, price: price2, category, image: imageFile});
    product = await product.save();
    await mkdirp('public/images/product_images/'+product._id);
    await mkdirp('public/images/product_images/'+product._id+'/gallery');
    await mkdirp('public/images/product_images/'+product._id+'/gallery/thumbs');
    if(imageFile){
        const productImage = req.files.image;
        const imgPath = 'public/images/product_images/'+product._id+'/'+imageFile;
        await productImage.mv(imgPath);
    }
    req.flash('success', 'Product added.');
    return res.redirect('/admin/products');
});

// router.get('/edit-product', async(req, res) =>{
//    let errors;
//    if(req.session.errors) errors = req.session.errors;
//    req.session.errors= null;
// });

// router.get('/edit-product/:id', async(req, res)=>{
//     let categories = await category.find();
//     let product = await Product.findOne({_id: req.params.id});
//     let result ={...product._doc, id: product._id, categories};
//     // let galleryDir = 'public/images/product_images/'+product._id+'/gallery';
//     // let galleryImages = null;

//     // galleryImages = await fs.readdir(galleryDir)
//     return res.render('admin/add_product',result);
// });


router.get('/edit-product/:id', async(req, res)=>{
    let errors = null;
    if(req.session.errors) errors = req.session.errors;
    req.session.errors = null;
    let categories = await category.find();
    let product = await Product.findOne({_id: req.params.id});
    let galleryDir = 'public/images/product_images/'+product._id+'/gallery';
    let galleryImages = await fs.readdir(galleryDir);
    let result ={...product._doc, 
        id: product._id, 
        categories, 
        category: product.category.replace(/\s+/g,'-').toLowerCase(), 
        image: product.image, galleryImages: galleryImages,
        price: parseFloat(product.price).toFixed(2)};
    return res.render('admin/edit_product',result);
});

router.post('/edit-product/:id', validateProduct, validateProductBody, async(req, res)=>{
    let imageFile = (req.files && typeof req.files.image !=="undefined" && typeof req.files.image.name !=="undefined") ? req.files.image.name : "";
    const id= req.params.id;
    const title = req.body.title;
    const slug = title.replace(/\s+/g,'-').toLowerCase();
    const desc = req.body.desc;
    const price = parseFloat(req.body.price).toFixed(2);
    const category = req.body.category;
    let productImage = req.body.productImage;
   
    const result = { title, slug, desc, price, category };
    if(imageFile !=""){
        result['image'] = imageFile;
    }
    let product = await Product.findOne({ slug, _id:{'$ne': id} });
    if (product) {
        req.flash('danger', 'Product title already exists. Please choose another.');
        return res.redirect('/admin/products/edit-product/'+id);
    } 
    Product.findById(id, function(err, product){
    
        if(err) console.log(err);
        product.title = title;
        product.slug = slug;
        product.desc = desc;
        product.category = category;
        product.price = price;
        if(imageFile !== ''){
            product.image = imageFile;
        }
        product.save(function(err){
            if(err) console.log(err);
            if(imageFile != '') {
                if(productImage != ''){
                    const path = 'public/images/product_images/'+id+'/'+productImage;
                    if (fs.existsSync(path)) {
                        fs.remove(path, function(err){
                            if(err) console.log(err);
                        })
                    }         
                }
                productImage = req.files.image;
                const imgPath = 'public/images/product_images/'+id+'/'+imageFile;
                productImage.mv(imgPath, function(err){
                    console.log(err);
                });
            }
             req.flash('success', 'Product updated successfully.');
            res.redirect('/admin/products');
        })
    })
});

module.exports = router;