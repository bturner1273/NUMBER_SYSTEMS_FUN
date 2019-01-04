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
                        $("#output_button_row").find("button").each(function(){
                            if($(this).attr("data-format") !== "CUSTOM"){
                                $(this).attr("disabled", true);
                            }
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
                        if($('#custom_encodings_div').is(":visible")){
                            $("#custom_encodings_div").slideUp();
                            var output_button_list = $("#output_button_row").find("button");
                            output_button_list.each(function(index){
                                $(this).attr("disabled", false);
                                if(index === 0){
                                    $(this).addClass("output-button-active");
                                    output_format = FORMAT.ASCII;
                                }else if(index === output_button_list.length - 1){
                                    $(this).removeClass("output-button-active");
                                }
                            });
                        }
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

        //NUM BITS INPUT ERROR CHECKING
        var custom_bits_input = $("#custom_bits_input");
        custom_bits_input.bind("input", function(){
            if(!BINARY_REGEX.test(custom_bits_input.val().trim()) && custom_bits_input.val().length != 0){
                notify.err("You must write valid binary digits (1 and 0 only)");
                custom_bits_input.val("");
            }
            custom_encoding_num_bits = Number($("#custom_encoding_num_bits").text());
            if(custom_bits_input.val().length > custom_encoding_num_bits && custom_bits_input.val().length != 0){
                notify.err("Your encoding cannot be larger than the bit length you set");
                custom_bits_input.val(custom_bits_input.val().slice(0, custom_encoding_num_bits));
            }
        });
        //END NUM BITS INPUT ERROR CHECKING

        // CUSTOM ENCODING LOGIC
        var indices = Object.freeze({"KEY_TO_VALUE" : 0, "VALUE_TO_KEY" : 1});
        var custom_encoding_format = indices.KEY_TO_VALUE;
        var encodings = {
            1: [{},{}],
            2: [{},{}],
            3: [{},{}],
            4: [{},{}],
            5: [{},{}],
            6: [{},{}],
            7: [{},{}],
            8: [{},{}]
        };
        var custom_encoding_num_bits;
        var custom_values_input = $("#custom_values_input");
        var encodings_table = $(".encodings_table");

        $("#bit_range").slider().on('input', function(){
            $("#custom_encoding_num_bits").text(this.value);
            custom_encoding_num_bits = Number($("#custom_encoding_num_bits").text());
            $("#custom_bits_input").attr("placeholder", this.value + " BIT(s)");
            loadEncodingTable();
        });

        function clearEncodingTable(){
            $(".encodings_table tr").each(function(){
                $(this).remove();
            });
        }

            var bindLastTRButton = function() {
                $(".encodings_table button").each(function(){
                        $(this).last().click(function(){
                        delete encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][$(this).closest("tr").find(".encoding").text().trim()];
                        delete encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][$(this).closest("tr").find(".value").text().trim()];
                        var this_button = $(this);
                        $(".encodings_table button").each(function(){
                            if($($($(this).closest("tr")).children().get(0)).html() === $(this_button.closest("tr").children().get(0)).html()){
                                $(this).closest("tr").remove();
                            }
                        });
                        this_button.closest("tr").remove();
                    });
                });
            };

        function loadEncodingTable(){
            clearEncodingTable();
            var dict_to_load = encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE];
            if(Object.keys(dict_to_load).length == 0 || dict_to_load == null){
                return;
            }
            var sorted_keys = [];
            for(var i in dict_to_load){
                sorted_keys.push(i);
            }
            sorted_keys = sorted_keys.sort();
            for(var j in sorted_keys){
                encodings_table.each(function(){
                    $(this).append("<tr><td>" + sorted_keys[j] +"</td><td><i class='far fa-arrow-right'></i></td><td>" + dict_to_load[sorted_keys[j].trim()] + "</td><td class='text-center'><button class='deleteKeyValuePair btn btn-sm btn-warning'><i class='fas fa-times'></i></button></td></tr>");
                });
                bindLastTRButton();
            }
        }

        function updateEncodingOutputText(){
            if(custom_encoding_format === indices.KEY_TO_VALUE){
                var editorVal = input_text_area.val();
                if(editorVal !== null && editorVal !== "")
                if(!BINARY_REGEX.test(editorVal.replace(SPACES_REGEX, ""))){
                    notify.err("You must enter valid binary digits (1 or 0) when in Key -> Value format");
                    input_text_area.val(editorVal.slice(0,editorVal.length-1));
                }else{
                    var regex = getRegex();
                    var keyList = editorVal.replace(SPACES_REGEX,"").trim().match(regex);
                    var strResult = "";
                    if(keyList){
                        for(var i = 0; i < keyList.length; i++){
                            if(encodings[custom_encoding_num_bits]){
                                strResult += encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][keyList[i]];
                            }
                        }
                        strResult = strResult.replace(/undefined/g, "?".repeat(custom_encoding_num_bits));
                        output_text_area.val(strResult);
                        return strResult;
                    } else {
                        return "";
                    }
                }
            }
            if(custom_encoding_format === indices.VALUE_TO_KEY){
                var valueList = input_text_area.val().match(/.{1,1}/g);
                var result = "";
                if(valueList){
                    for(var j = 0; j < valueList.length; j++){
                        if(encodings[custom_encoding_num_bits]){
                            result += encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][valueList[j]];
                        }
                    }
                    result = result.replace(/undefined/g, "?".repeat(custom_encoding_num_bits));
                    return result;
                } else {
                    return "";
                }
            }
        }

        function getRegex(custom_encoding_num_bitsCHANGEME){
            var regex;
            switch(custom_encoding_num_bits){
                case 1:
                    regex = /.{1,1}/g;
                    break;
                case 2:
                    regex = /.{1,2}/g;
                    break;
                case 3:
                    regex = /.{1,3}/g;
                    break;
                case 4:
                    regex = /.{1,4}/g;
                    break;
                case 5:
                    regex = /.{1,5}/g;
                    break;
                case 6:
                    regex = /.{1,6}/g;
                    break;
                case 7:
                    regex = /.{1,7}/g;
                    break;
                case 8:
                    regex = /.{1,8}/g;
                    break;
            }
            return regex;
        }

        custom_bits_input.bind("input", function(){
            if(!BINARY_REGEX.test(custom_bits_input.val().trim()) && custom_bits_input.val().length != 0){
                notify.err("You must write valid binary digits (1 and 0 only)");
                custom_bits_input.val("");
            }
            custom_encoding_num_bits = Number($("#custom_encoding_num_bits").text());
            if(custom_bits_input.val().length > custom_encoding_num_bits && custom_bits_input.val().length != 0){
                notify.err("Your encoding cannot be larger than the bit length you set");
                custom_bits_input.val(custom_bits_input.val().slice(0, custom_encoding_num_bits));
            }
        });

        $("#submit_encoding").click(function(){
            if(custom_bits_input.val().trim().length == custom_encoding_num_bits){
                var invalid_encoding = false;
                $(".encodings_table tr").each(function(){
                    if($(this).find(".encoding").text() == custom_bits_input.val()){
                        notify.err("You may not overwrite your own keys. Key: " + custom_bits_input.val().trim() + " is already contained in the table");
                        invalid_encoding = true;
                    }
                });
                if(invalid_encoding){
                    custom_bits_input.val("");
                    custom_values_input.val("");
                    return;
                }
                var val = custom_values_input.val().charAt(0) == " " ? "[space]" : custom_values_input.val().charAt(0);
                encodings_table.each(function(){
                    if(encodings_table.is(":hidden")){
                        $(".encodings_table_wrapper").show();
                        $(".no_encodings_to_display").hide();
                    }
                    $(this).append("<tr><td class='encoding'>" + custom_bits_input.val() + "</td><td><i class='far fa-arrow-right'></i></td><td class='value'>" + val + "</td><td class='text-center'><button class='deleteKeyValuePair btn btn-sm btn-warning'><i class='fas fa-times'></i></button></td></tr>");
                });
                bindLastTRButton();
                encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][custom_bits_input.val().trim()] = custom_values_input.val().charAt(0);
                encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][custom_values_input.val().charAt(0)] = custom_bits_input.val().trim();
            }else{
                notify.err("Your number of bits must match the bit length you set and you must have a value of length 1 for the encoding key");
            }
            custom_bits_input.val("");
            custom_values_input.val("");
        });

        $("#share_encodings_table").click(function(){
            // ENCODING EXAMPLE WORKS
            // var dict = { 
            //     brad: 1,
            //     mike: 1,
            //     jynx: 1
            // }
            // var encoded = encodeURIComponent(window.btoa(JSON.stringify(dict)));
            // var decoded = JSON.parse(window.atob(decodeURIComponent(encoded)));
            //
            // console.log("base64 string: " + encoded);
            // console.log("decoded object: " , decoded);

            var dict_to_encode;

        });

        $("#copy_input").click(function(){
            input_text_area.select();
            document.execCommand("copy");
            notify.suc(input_text_area.val() + " copied to clipboard!");
        });

        $("#copy_output").click(function(){
            output_text_area.select();
            document.execCommand('copy');
            notify.suc(output_text_area.val() + " copied to clipboard!");
        });

        var swap_custom = $("#swap_custom");
        swap_custom.click(function(){
            var temp = input_text_area.val();
            input_text_area.val(output_text_area.val());
            output_text_area.val(temp);
            if(custom_encoding_format === indices.KEY_TO_VALUE){
                custom_encoding_format = indices.VALUE_TO_KEY;
                swap_custom.text("Value -> Key");
            }else{
                custom_encoding_format = indices.KEY_TO_VALUE;
                swap_custom.text("Key -> Value");
            }
        });

        var swap_regular = $("#swap_regular");
        swap_regular.click(function(){
            if(input_format === FORMAT.CUSTOM){
                swap_custom.trigger('click');
            }else{
                // save value of text areas before they are cleared on click trigger
                var input_text = input_text_area.val();
                var output_text = output_text_area.val();

                // swap input and output format
                var temp = input_format;
                input_format = output_format;
                output_format = temp;

                // trigger button clicks on the correct buttons
                // so the user can see what they are converting from the UI
                $($("#input_button_row").children().children().get(input_format)).trigger("click");
                $($("#output_button_row").children().children().get(output_format)).trigger("click");

                // swap input and output strings in the textareas
                output_text_area.val(input_text);
                input_text_area.val(output_text);
            }
        });
        // END CUSTOM ENCODING LOGIC


        // INPUT TEXT AREA BINDING
        input_text_area.bind("input", function(){
            var inp_val = input_text_area.val();
            // TODO double check logic here
            if(!(inp_val.trim().length != 0 && inp_val != null)){
                output_text_area.val("");
                return;
            }

            if(input_format === FORMAT.BINARY){
                if(!BINARY_REGEX.test(inp_val.replace(SPACES_REGEX,"").trim())){
                    notify.err("You must write valid binary if you choose to use it as your input format (1 and 0 only)");
                    input_text_area.val(inp_val.slice(0, inp_val.length-1));
                }
            }
            if(input_format === FORMAT.HEXADECIMAL){
                if(!HEXADECIMAL_REGEX.test(inp_val.replace(SPACES_REGEX,"").trim())){
                    notify.err("You must write valid hex if you choose to use it as your input format (0-9, a-f, and A-F only)");
                    input_text_area.val(inp_val.slice(0, inp_val.length-1));
                }
            }

            var result = "";
            if(input_format === output_format && input_format !== FORMAT.CUSTOM){
                result = inp_val;
            }
            if(input_format === FORMAT.CUSTOM){
                result = updateEncodingOutputText();
            }
            if(input_format === FORMAT.BINARY && output_format === FORMAT.HEXADECIMAL){
                result = parseInt(Number(inp_val.replace(SPACES_REGEX,"")), 2).toString(16).toUpperCase();
            }
            if(input_format === FORMAT.HEXADECIMAL && output_format === FORMAT.BINARY){
                result = parseInt(inp_val.replace(SPACES_REGEX,""), 16).toString(2);
            }
            if(input_format === FORMAT.ASCII && output_format === FORMAT.BINARY){
                result = ascii_to_base(inp_val, 2);
            }
            if(input_format === FORMAT.ASCII && output_format === FORMAT.HEXADECIMAL){
                result = ascii_to_base(inp_val, 16);
            }
            if(input_format === FORMAT.BINARY && output_format === FORMAT.ASCII){
                result = base2_to_ascii(inp_val);
            }
            if(input_format === FORMAT.HEXADECIMAL && output_format === FORMAT.ASCII){
                result = base16_to_ascii(inp_val);
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
