$(function(){
    if($('textarea#ta-content').length){
        CKEDITOR.replace('ta-content');
    }

    $('a.confirmDeletion').on('click', function(){
        if(!confirm('Are you sure you want to delete it?')) return false;
    });

    if($('[data-fancybox]').length){
        $('[data-fancybox]').fancybox();
    }

    $('a.clearCart').on('click', function(){
        if(!confirm('Are you sure you want to clear your cart?')) return false;
    });

    $('a.buynow').on('click', function(e){
        e.preventDefault();
        $.get('/cart/buynow', function(){
            $('form.paypalForm input[type=image]').click();
            $('.ajaxbg').show();
        });
    });
});