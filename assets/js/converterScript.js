var CODEC = function(){
    // MAKE RESIZE PRETTY
    var button_divs = $(".button-holder");
    var resizeSM  = function(){
        $(button_divs.last()).removeClass("border-top");
        button_divs.each(function(){
            $(this).addClass("border-left");
        });
    };
    var resizeLG = function(){
        $(button_divs.last()).addClass("border-top");
        button_divs.each(function(){
            $(this).removeClass("border-left");
        });
    };

    if(jQuery(window).width() < 575){
        resizeSM();
    }

    jQuery(window).resize(function(){
        if(jQuery(window).width() < 575){
            resizeSM();
        }else {
            resizeLG();
        }
    });
    // END MAKE RESIZE PRETTY


    // FUNCTIONS
    var ascii_to_base, base2_to_ascii, base16_to_ascii, clear_output_textarea, init;

    clear_output_textarea = function(){
        $("#output_text_area").val("");
    };

    ascii_to_base = function (input_val, base) {
        clear_output_textarea();
        if (input_val != null) {
            var toReturn = "";
            for (var i = 0; i < input_val.length; i++) {
                if (base == 2) {
                    if (input_val[i].charCodeAt(0).toString(base).length < 8) {
                        toReturn += "0".repeat(8 - input_val[i].charCodeAt(0).toString(base).length)+input_val[i].charCodeAt(0).toString(base) + " ";
                    } else {
                        toReturn += input_val[i].charCodeAt(0).toString(base) + " ";
                    }
                } else if (base == 16) {
                    if (input_val[i].charCodeAt(0).toString(base).length < 2) {
                        toReturn += "0".repeat(2 - input_val[i].charCodeAt(0).toString(base).length)+input_val[i].charCodeAt(0).toString(base) + " ";
                    } else {
                        toReturn += input_val[i].charCodeAt(0).toString(base) + " ";
                    }
                }
            }
            return toReturn;
        }
        return;
    };

    // text is $("#input_text_area").val()
    base2_to_ascii = function (text) {
        var list = text.replace(SPACES_REGEX,"").trim().match(/.{1,8}/g);
        if(list != null){
            var toReturn = "";
            for(var i = 0; i < list.length; i++){
                toReturn += String.fromCharCode(parseInt(Number(list[i]), 2).toString(10)) + " ";
            }
            return toReturn;
        }
        return;
    };

    base16_to_ascii = function (text) {
        var list = text.replace(SPACES_REGEX,"").trim().match(/.{1,2}/g);
        if(list != null){
            var toReturn = "";
            for(var i = 0; i < list.length; i++){
                toReturn += String.fromCharCode(parseInt(list[i], 16).toString(10)) + " ";
            }
            return toReturn;
        }
        return;
    };

}();
