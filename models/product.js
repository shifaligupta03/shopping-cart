const mongoose = require('mongoose');
const {check} = require('express-validator/check');

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
];

exports.Product = Product;
exports.validateProduct = validateProduct;