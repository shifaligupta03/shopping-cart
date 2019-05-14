const express = require('express');
const router = express.Router();
const {Product} = require('../models/product');
const config= require('config');
const productImagePath = config.get('product_images_path');

router.get('/add/:product', async(req, res) => {
    const slug= req.params.product;
    let product = await Product.findOne({slug});
    if(req.session && req.session.cart){
        let cart = req.session.cart;
        // let newItem= true;
        let filtered = cart.filter(function(prod){
            return prod.title == slug;
        });
        
        if(filtered.length){         
            filtered[0].qty++;               
        }else{
            cart.push({ title: slug, 
                qty:1,
                price: parseFloat(product.price).toFixed(2), 
                image: '/images/product_images/'+product._id+'/'+product.image
            });
        }

    } else{
        req.session.cart =[];
        req.session.cart.push({ title: slug, 
                            qty:1,
                            price: parseFloat(product.price).toFixed(2), 
                            image: '/images/product_images/'+product._id+'/'+product.image
                        });

    }
    req.flash('success','Product added');
    res.redirect('back');
});

router.get('/checkout', async(req, res) => {

    res.render('checkout',{title:'Checkout', cart: req.session.cart});
});


router.get('/update/:product', async(req, res) => {
    let slug= req.params.product;
    let cart = req.session.cart;
    let action = req.query.action;
    let filtered = cart.filter(function(prod){
        return prod.title == slug;
    });
    if(filtered.length){
        switch(action){
            case 'add':
                filtered[0].qty++;
                break;
            case 'remove':
                filtered[0].qty--;
                break;
            case 'clear':
                cart.splice(filtered,1);
                break;

        }
    }

    req.flash('success','Product updated');
    res.redirect('/cart/checkout');
});


module.exports = router;