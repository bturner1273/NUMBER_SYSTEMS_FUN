var CODEC = function(){

    // FUNCTIONS
    var ascii_to_base, base2_to_ascii, base16_to_ascii, clear_output_textarea, resize_handler, init;

    // constants
    var FORMAT = {
        "ASCII": 0,
        "BINARY": 1,
        "HEXADECIMAL": 2,
        "CUSTOM": 3
    };
    var SPACES_REGEX = /\s/gi;
    var BINARY_REGEX = /^[01]+$/;
    var HEXADECIMAL_REGEX = /^[0-9A-Fa-f]*$/;



    // MAKE RESIZE PRETTY
    resize_handler = function(){
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
    }();
    // END MAKE RESIZE PRETTY

    clear_output_textarea = function(){
        $("#output_text_area").val("");
    };

    clear_input_textarea = function(){
        $("#input_text_area").val("");
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

    // BIND EVENTS
    init = function(){
        var input_buttons = $("#input_button_row").find("button");
        var output_buttons = $("#output_button_row").find("button");
        var input_text_area = $("#input_text_area");
        var output_text_area = $("#output_text_area");

        // INPUT/OUTPUT FORMAT TOGGLE CODE
        var input_format = FORMAT.ASCII;
        var output_format = FORMAT.BINARY;
        var button_toggler = function(button_list, addRemoveClass, input){
            button_list.each(function(){
                var this_button = $(this);
                this_button.click(function(){
                    if(this_button.attr('data-format') === "CUSTOM"){
                        $("#input_div").addClass("border-bottom");
                        $("#custom_encodings_div").slideDown();
                        $("button").each(function(){
                            $(this).removeClass("input-button-active");
                            $(this).removeClass("output-button-active");
                        });
                        $("button[data-format='CUSTOM']").each(function(index){
                            if(index == 0){
                                $(this).addClass("input-button-active");
                            }else{
                                $(this).addClass("output-button-active");
                            }
                            input_format = FORMAT.CUSTOM;
                            output_format = FORMAT.CUSTOM;
                        });
                        if(input){
                            input_format = FORMAT[$(this).attr("data-format")];
                            input_text_area.val("");
                            output_text_area.val("");
                        }else {
                            output_format = FORMAT[$(this).attr("data-format")];
                            output_text_area.val("");
                            input_text_area.trigger("input");
                        }
                        return;
                    }else  {
                       $("#custom_encodings_div").slideUp();
                    }
                    button_list.each(function(){
                        if($(this).attr("data-format") !== this_button.attr("data-format")){
                            $(this).removeClass(addRemoveClass);
                        }else{
                            $(this).addClass(addRemoveClass);
                            if(input){
                                input_format = FORMAT[$(this).attr("data-format")];
                                input_text_area.val("");
                                output_text_area.val("");
                            }else {
                                output_format = FORMAT[$(this).attr("data-format")];
                                output_text_area.val("");
                                input_text_area.trigger("input");
                            }
                        }
                    });
                });
            });
        };
        button_toggler(input_buttons, "input-button-active", true);
        button_toggler(output_buttons, "output-button-active", false);
        // END INPUT/OUTPUT FORMAT TOGGLE CODE


        // INPUT TEXT AREA BINDING
        input_text_area.bind("input", function(){
            var inp_val = input_text_area.val();
            // TODO double check logic here
            if(!(input_text_area.val().trim().length != 0 && input_text_area.val() != null)){
                output_text_area.val("");
                return;
            }

            if(input_format === FORMAT.BINARY){
                if(!BINARY_REGEX.test(input_text_area.val().replace(SPACES_REGEX,"").trim())){
                    notify.err("You must write valid binary if you choose to use it as your input format (1 and 0 only)");
                    input_text_area.val(input_text_area.val().slice(0, input_text_area.val().length-1));
                }
            }
            if(input_format === FORMAT.HEXADECIMAL){
                if(!HEXADECIMAL_REGEX.test(input_text_area.val().replace(SPACES_REGEX,"").trim())){
                    notify.err("You must write valid hex if you choose to use it as your input format (0-9, a-f, and A-F only)");
                    input_text_area.val(input_text_area.val().slice(0, input_text_area.val().length-1));
                }
            }

            var result = "";
            if(input_format === output_format){
                result = input_text_area.val();
            }
            if(input_format !== FORMAT.CUSTOM && output_format === FORMAT.CUSTOM){
                notify.err("Cannot convert from TEXT, BINARY, or HEX to CUSTOM");
            }
            if(input_format === FORMAT.BINARY && output_format === FORMAT.HEXADECIMAL){
                result = parseInt(Number(input_text_area.val().replace(SPACES_REGEX,"")), 2).toString(16).toUpperCase();
            }
            if(input_format === FORMAT.HEXADECIMAL && output_format === FORMAT.BINARY){
                result = parseInt(input_text_area.val().replace(SPACES_REGEX,""), 16).toString(2);
            }
            if(input_format === FORMAT.ASCII && output_format === FORMAT.BINARY){
                result = ascii_to_base(input_text_area.val(), 2);
            }
            if(input_format === FORMAT.ASCII && output_format === FORMAT.HEXADECIMAL){
                result = ascii_to_base(input_text_area.val(), 16);
            }
            if(input_format === FORMAT.BINARY && output_format === FORMAT.ASCII){
                result = base2_to_ascii(input_text_area.val());
            }
            if(input_format === FORMAT.HEXADECIMAL && output_format === FORMAT.ASCII){
                result = base16_to_ascii(input_text_area.val());
            }
            output_text_area.val(result);
        });
    }();

    // NOTY FUNCTIONALITY
    var notify = (function () {
        var suc, err;
        suc = function (txt, timeout, manualclose) {
            var n = noty({text: "<b>" + txt + "</b>", type: "success", layout: "topCenter"});
            if (!manualclose) {
                setTimeout(function () {n.close(); }, timeout === undefined ? 2000 : timeout);
            }
        };

        err = function (txt, timeout, manualclose) {
            var n = noty({text: "<b>" + txt + "</b>", type: "error", layout: "topCenter"});
            if (!manualclose) {
                setTimeout(function () {n.close(); }, timeout === undefined ? 3000 : timeout);
            }
        };

        return {
            suc: suc,
            err: err
        };
    }());
    // END NOTY FUNCTIONALITY

    return {
        init: init
    };
}();
