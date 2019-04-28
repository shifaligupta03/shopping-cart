const express = require('express');
const router = express.Router();
const {Page, validatePage} = require('../models/page');
const validatePageBody = require('../middleware/adminPage');

//mongodb+srv://admin:admin@cart-ldl8w.mongodb.net/shopping_cart?retryWrites=true


router.get('/', async(req, res)=>{
    try{
        const pages = await Page.find().sort({sorting:1});
        return res.render('admin/pages',{pages});
    } catch(e){
        console.log(e);
        throw new Error(e);
    }
    
});

router.get('/add-page', function(req, res){
    const title ="";
    const slug ="";
    const content ="";

    res.render('admin/add_page',{
       title, slug, content
    });
});

router.post('/add-page', validatePage, validatePageBody, async (req, res) => {
    const title = req.body.title;
    const slug = getSlug(req.body.slug, title);
    const content = req.body.content;
    const result = { title, slug, content };

    let page = await Page.findOne({ slug });
    if (page) {
        req.flash('danger', 'Slug already exists. Please choose another.');
        return res.render('admin/add_page', result);
    }
    result['sorting'] = 0;
    page = new Page(result);
    page = await page.save();
    req.flash('success', 'Page added successfully.');
    res.redirect('/admin/pages');
});

router.post('/reorder-page', async(req, res)=>{
  let ids = req.body['id[]'];
  let count =0;

    ids.forEach(function (id) {
        count++;
        (async function(count){
            let page = await Page.findById(id);
            page.sorting=count;
            await page.save();
        })(count);
    });
});

router.get('/edit-page/:id', async(req, res)=>{
    const page = await Page.findById(req.params.id);
    return res.render('admin/edit_page',{title: page.title, slug: page.slug, content: page.content, id: page._id});
});

router.post('/edit-page/:id', validatePage, validatePageBody, async(req, res)=>{
    const title = req.body.title;
    const slug = getSlug(req.body.slug, title);
    const content = req.body.content;
    const result = { title, slug, content };
    const id= req.params.id;

    let page = await Page.findOne({ slug, _id:{'$ne': id} });
    if (page) {
        result['id'] = id;
        req.flash('danger', 'Slug already exists. Please choose another.');
        return res.render('admin/edit_page', result);
    }

    page = await Page.findOneAndUpdate({"_id": id}, result,{new: true});
    req.flash('success', 'Page updated successfully.');
    res.redirect('/admin/pages');
});

router.get('/delete-page/:id', async(req, res)=>{
    const page = await Page.findByIdAndRemove(req.params.id);
    req.flash('success', 'Page deleted successfully.');
    res.redirect('/admin/pages');
});


function getSlug(slug, title){
    slug = slug.replace(/ /g, '-').toLowerCase();
    if (slug == "") slug = title.replace(/ /g, '-').toLowerCase();
    return slug;
}





module.exports = router;