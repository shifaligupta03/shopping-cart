const mongoose = require('mongoose');
const {check} = require('express-validator/check');

const CategorySchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    slug:{
        type:String,
    }
});

const Category = mongoose.model('Category', CategorySchema);

const validateCategory = [
    check('title', 'Title must have a value').not().isEmpty({ ignore_whitespace: false }),
];

module.exports.category = Category;
module.exports.validateCategory = validateCategory;