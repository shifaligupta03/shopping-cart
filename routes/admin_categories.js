const express = require('express');
const router = express.Router();
const {category, validateCategory} = require('../models/category');

const validateCategoryBody = require('../middleware/adminCategory');


router.get('/', async(req, res)=>{
    const categories = await category.find();
    return res.render('admin/categories',{categories});
});

router.get('/add-category', function(req, res){
    const title ="";
    const slug ="";
    const id="";

    res.render('admin/add_category',{
       title, slug, id
    });
});

router.post('/add-category', validateCategory, validateCategoryBody, async (req, res) => {
    const title = req.body.title;
    const slug = title.replace(/ /g, '-').toLowerCase();
    const result = { title, slug };

    let Category = await category.findOne({ slug });
    if (Category) {
        req.flash('danger', 'Title already exists. Please choose another.');
        return res.render('admin/add_category', result);
    }
    Category = new category(result);
    Category = await Category.save();
    req.flash('success', 'Category added successfully.');
    res.redirect('/admin/categories');
});

router.get('/edit-category/:id', async(req, res)=>{
    const Category = await category.findById(req.params.id);
    return res.render('admin/add_category',{title: Category.title, slug: Category.slug, id: Category._id});
});

router.post('/edit-category/:id', validateCategory, validateCategoryBody, async(req, res)=>{
    const title = req.body.title;
    const slug = title.replace(/ /g, '-').toLowerCase();
    const result = { title, slug };
    const id= req.params.id;

    let Category = await category.findOne({ slug, _id:{'$ne': id} });
    if (Category) {
        result['id'] = id;
        req.flash('danger', 'Title already exists. Please choose another.');
        return res.render('admin/add_category', result);
    }

    Category = await category.findOneAndUpdate({"_id": id}, result,{new: true});
    req.flash('success', 'Category updated successfully.');
    res.redirect('/admin/categories');
});

router.get('/delete-category/:id', async(req, res)=>{
    const Category = await category.findByIdAndRemove(req.params.id);
    req.flash('success', 'Category deleted successfully.');
    res.redirect('/admin/categories');
});

module.exports = router;