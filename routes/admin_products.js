const express = require('express');
const router = express.Router();
const mkdirp = require('mkdirp');
const fs = require('fs-extra');
const resizeImg = require('resize-img');
const {Product, validateProduct} = require('../models/product');
const {category, validateCategory} = require('../models/category');
const validateProductBody = require('../middleware/adminProduct');
const config = require('config');
const productImagesPath = config.get('product_images_path');


router.get('/', async(req, res)=>{
    const products = await Product.find();
    const count = products.length;
    return res.render('admin/products',{products, count});
});

router.get('/add-product', async(req, res) =>{
    // let {title, desc, price, id}
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
    await mkdirp(productImagesPath+product._id);
    await mkdirp(productImagesPath+product._id+'/gallery');
    await mkdirp(productImagesPath+product._id+'/gallery/thumbs');
    if(imageFile){
        const productImage = req.files.image;
        const imgPath = productImagesPath+product._id+'/'+imageFile;
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
    let galleryDir = productImagesPath+product._id+'/gallery';
    let galleryImages = [];
    if (fs.existsSync(galleryDir)) {
        galleryImages = await fs.readdir(galleryDir);
    }
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
    let {title, desc, price, category,productImage} = {...req.body};
    const id= req.params.id;
    const slug = title.replace(/\s+/g,'-').toLowerCase();
    price = parseFloat(req.body.price).toFixed(2);
   
    let product = await Product.findOne({ slug, _id:{'$ne': id} });
    if (product) {
        req.flash('danger', 'Product title already exists. Please choose another.');
        return res.redirect('/admin/products/edit-product/'+id);
    } 
    const result = { title, slug, desc, category, price };
    if(imageFile !== ''){
        result['image'] = imageFile;
    }
    product = await Product.findOneAndUpdate({"_id": id}, result,{new: true});
    if(imageFile != '') {
        if(productImage != ''){
            const path = productImagesPath+id+'/'+productImage;
            if (fs.existsSync(path)) {
                fs.remove(path, function(err){
                    if(err) console.log(err);
                })
            } else {
                await mkdirp(productImagesPath+id);
                await mkdirp(productImagesPath+id+'/gallery');
                await mkdirp(productImagesPath+id+'/gallery/thumbs');
            }        
        }
        productImage = req.files.image;
        const imgPath = productImagesPath+id+'/'+imageFile;
        await productImage.mv(imgPath);
    }
    req.flash('success', 'Product updated successfully.');
    res.redirect('/admin/products');
});


router.post('/product-gallery/:id', async(req, res)=>{
   let productImage = req.files.file;
   const id = req.params.id;
   const galleryPath = productImagesPath+id+'/gallery/'+req.files.file.name;
   const thumbsPath = productImagesPath+id+'/gallery/thumbs/'+req.files.file.name;
   await productImage.mv(galleryPath);
   let buffer = await resizeImg(fs.readFileSync(galleryPath), {width:100, height: 100});
   await fs.writeFileSync(thumbsPath, buffer);
   res.sendStatus(200);
});

router.get('/delete-image/:image', async(req, res)=>{
    const id = req.query.id;
    const originalImagePath = productImagesPath+id+'/gallery/'+req.params.image;
    const thumbPath = productImagesPath+id+'/gallery/thumbs/'+req.params.image;
    await fs.remove(originalImagePath);
    await fs.remove(thumbPath);
    req.flash('success', 'Image deleted.');
    res.redirect('/admin/products/edit-product/'+id);
 });


router.get('/delete-product/:id', async(req, res)=>{
    const id = req.params.id;
    const product = await Product.findByIdAndRemove(id);
    await fs.remove(productImagesPath+id);
    req.flash('success', 'Product deleted successfully.');
    res.redirect('/admin/products');
    
 });


module.exports = router;