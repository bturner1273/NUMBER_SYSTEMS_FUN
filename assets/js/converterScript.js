$(function(){
    var button_divs = $(".button-holder");
    jQuery(window).resize(function(){
        if(jQuery(window).width() < 575){
            $(button_divs.last()).removeClass("border-top");
            button_divs.each(function(){
                $(this).addClass("border-left");
            });
        }else {
            $(button_divs.last()).addClass("border-top");
            button_divs.each(function(){
                $(this).removeClass("border-left");
            });
        }
    });
});
