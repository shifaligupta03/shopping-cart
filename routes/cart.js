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
    let index = cart.findIndex(function(prod, i){
        return prod.title == slug;
      });
   
    if(cart.length && cart[index]){
        switch(action){
            case 'add':
                cart[index].qty++;
                break;
            case 'remove':
                cart[index].qty--;

                if(cart[index].qty<1) cart.splice(index,1);
                break;
            case 'clear':
                cart.splice(index,1);
                break;

        }
    }

    req.flash('success','Product updated');
    res.redirect('/cart/checkout');
});

router.get('/clear', async(req, res) => {
    req.session.cart=[];
    req.flash('success','Cart cleared.');
    res.redirect('/cart/checkout');
});

router.get('/buynow', async(req, res) => {
    req.session.cart=[];
    res.sendStatus(200);
});


module.exports = router;