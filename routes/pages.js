const express = require('express');
const router = express.Router();
const {Page} = require('../models/page');

router.get('/', async(req, res) => {
    let page = await Page.findOne({slug:'home'});
    res.render('index',{title:page.title, content: page.content});
});

router.get('/:slug', async(req, res) =>{
    const slug = req.params.slug;
    let page = await Page.findOne({slug});
    res.render('index',{title:page.title, content: page.content});

});

module.exports = router;