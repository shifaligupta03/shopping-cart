const mongoose = require('mongoose');
const {check} = require('express-validator/check');
const path = require('path');
const config= require('config');

const ProductSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    slug:{
        type:String,
    },
    desc:{
        type:String,
        required: true
    },
    category:{
        type:String,
        required: true
    },
    price:{
        type:String,
        required: true
    },
    image:{
        type:String,
    }
});

const Product = mongoose.model('Product', ProductSchema);

const validateProduct = [
    check('title', 'Title must have a value').not().isEmpty({ ignore_whitespace: false }),
    check('desc', 'Description must have a value').not().isEmpty({ ignore_whitespace: false }),
    check('price', 'Price must have a value').isDecimal(),
    check('image', 'You must upload an image').custom((value,{req}) => {
        let imageFile= (typeof(req.files.image.name) !== 'undefined') ? req.files.image.name : '';
        let fileext = path.extname(imageFile).toLowerCase();
        let uploadExtensions = config.get('upload-file-ext');
        return (uploadExtensions.includes(fileext));
    }),
   
];

exports.Product = Product;
exports.validateProduct = validateProduct;