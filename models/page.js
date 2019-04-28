const mongoose = require('mongoose');
const {check} = require('express-validator/check');

const PageSchema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    slug:{
        type:String,
    },
    content:{
        type:String,
        required: true
    },
    sorting:{
        type:Number,
    }
});

const Page = mongoose.model('Page', PageSchema);

const validatePage = [
    check('title', 'Title must have a value').not().isEmpty({ ignore_whitespace: false }),
    check('content', 'Content must have a value').not().isEmpty({ ignore_whitespace: false }),
];

exports.Page = Page;
exports.validatePage = validatePage;