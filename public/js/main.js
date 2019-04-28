$(function(){
    if($('textarea#ta-content').length){
        CKEDITOR.replace('ta-content');
    }

    $('a.confirmDeletion').on('click', function(){
        if(!confirm('Are you sure you want to delete it?')) return false;
    });
});