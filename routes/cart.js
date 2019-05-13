const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const config= require('config');
const productImagePath = config.get('product_images_path');

router.get('/add/:product', async(req, res) => {
    const slug= req.params.product;
    let product = await Product.findOne({slug});
    console.log('product');
    console.log(product);
    if(req.session && req.session.cart){
        let cart = req.session.cart;
        // let newItem= true;
        var filtered = cart.filter(function(prod){
            return prod.title == slug;
        });
        
        if(filtered.length){         
            filtered[0].qty++;
            filtered[0].price+= filtered[0].price;
               
        }else{
            cart.push({ title: slug, 
                qty:1,
                price: parseFloat(product.price).toFixed(2), 
                image: productImagePath+product._id+'/'+product.image
            });
        }

    } else{
        req.session.cart =[];
        req.session.cart.push({ title: slug, 
                            qty:1,
                            price: parseFloat(product.price).toFixed(2), 
                            image: productImagePath+product._id+'/'+product.image
                        });

    }
    req.flash('success','Product added');
    res.redirect('back');
});

router.get('/checkout', async(req, res) => {
    res.render('checkout',{title:'Checkout', cart: req.session.cart})
});


module.exports = router;