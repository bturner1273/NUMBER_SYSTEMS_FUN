$(function(){
    setUpEditor();
    // ASCII/BINARY/HEXADECIMAL CONVERTER CODE
    var format = Object.freeze({"ASCII":0, "BINARY":1, "HEXADECIMAL":2});
    var input_format = format.ASCII;
    var output_format = format.BINARY;
    bind_radios_labels_foolproof(".input_format_foolproof", 0, 3);
    bind_radios_labels_foolproof(".output_format_foolproof", 3, 6);
    var BINARY_REGEX = /^[01]+$/;
    var HEXADECIMAL_REGEX = /^[0-9A-Fa-f]*$/;

    $("#input_text_area").bind("input", function(){
        var output_text_area = $("#output_text_area");
        if($("#input_text_area").val().trim().length != 0 && $("#input_text_area").val() != null){
            if(input_format === format.BINARY){
                if(!BINARY_REGEX.test($("#input_text_area").val().replace(/\s/gi,"").trim())){
                    notify.err("You must write valid binary if you choose to use it as your input format (1 and 0 only)");
                    $("#input_text_area").val($("#input_text_area").val().slice(0, $("#input_text_area").val().length-1));
                }
            }
            if(input_format === format.HEXADECIMAL){
                if(!HEXADECIMAL_REGEX.test($("#input_text_area").val().replace(/\s/gi,"").trim())){
                    notify.err("You must write valid hex if you choose to use it as your input format (0-9, a-f, and A-F only)");
                    $("#input_text_area").val($("#input_text_area").val().slice(0, $("#input_text_area").val().length-1));
                }
            }
            if(input_format === output_format){
                output_text_area.val($("#input_text_area").val());
            }
            if(input_format === format.BINARY && output_format === format.HEXADECIMAL){
                output_text_area.val(parseInt(Number($("#input_text_area").val().replace(/\s/gi,"")), 2).toString(16).toUpperCase());
            }
            if(input_format === format.HEXADECIMAL && output_format === format.BINARY){
                output_text_area.val(parseInt($("#input_text_area").val().replace(/\s/gi,""), 16).toString(2));
            }
            if(input_format === format.ASCII && output_format === format.BINARY){
                output_text_area.val(ascii_to_base(2));
            }
            if(input_format === format.ASCII && output_format === format.HEXADECIMAL){
                output_text_area.val(ascii_to_base(16));
            }
            if(input_format === format.BINARY && output_format === format.ASCII){
                output_text_area.val(base2_to_ascii());
            }
            if(input_format === format.HEXADECIMAL && output_format === format.ASCII){
                output_text_area.val(base16_to_ascii());
            }
        } else {
            output_text_area.val("");
        }
    });

    function base2_to_ascii(){
        var list = $("#input_text_area").val().replace(/\s/gi,"").trim().match(/.{1,8}/g);
        if(list != null){
            var toReturn = "";
            for(var i = 0; i < list.length; i++){
                toReturn += String.fromCharCode(parseInt(Number(list[i]), 2).toString(10)) + " ";
            }
            return toReturn;
        }
        return;
    }

    function base16_to_ascii(){
        var list = $("#input_text_area").val().replace(/\s/gi,"").trim().match(/.{1,2}/g);
        if(list != null){
            var toReturn = "";
            for(var i = 0; i < list.length; i++){
                toReturn += String.fromCharCode(parseInt(list[i], 16).toString(10)) + " ";
            }
            return toReturn;
        }
        return;
    }

    function ascii_to_base(base){
        $("#output_text_area").val("");
        var input_val = $("#input_text_area").val().trim();
        if(input_val != null){
            var toReturn = "";
            for(var i = 0; i < input_val.length; i++){
                if(base == 2){
                    if(input_val[i].charCodeAt(0).toString(base).length < 8){
                        toReturn += "0".repeat(8 - input_val[i].charCodeAt(0).toString(base).length)+input_val[i].charCodeAt(0).toString(base) + " ";
                    }else{
                        toReturn += input_val[i].charCodeAt(0).toString(base) + " ";
                    }
                }else if(base == 16){
                    if(input_val[i].charCodeAt(0).toString(base).length < 2){
                        toReturn += "0".repeat(2 - input_val[i].charCodeAt(0).toString(base).length)+input_val[i].charCodeAt(0).toString(base) + " ";
                    }else{
                        toReturn += input_val[i].charCodeAt(0).toString(base) + " ";
                    }
                }
            }
            return toReturn;
        }
        return;
    }

    function bind_radios_labels_foolproof(_class, slice_start, slice_end){
        $('input[type=radio]').slice(slice_start, slice_end).change(function () {
            $("#output_text_area").val("");
            var enum_lookup_string;
              switch($(this).val()){
                  case "1":
                        enum_lookup_string = "BINARY";
                        $(_class).text(enum_lookup_string);
                        break;
                  case "2":
                        enum_lookup_string = "HEXADECIMAL";
                        $(_class).text(enum_lookup_string);
                        break;
                  default:
                        enum_lookup_string = "ASCII";
                        $(_class).text(enum_lookup_string);
                        break;
              }
              if(slice_end <= 3){
                  input_format = format[enum_lookup_string];
                  $("#input_text_area").val("");
              }else {
                  output_format = format[enum_lookup_string];
                  $("#input_text_area").trigger("input");
              }
        });
    }
    // END ASCII/BINARY/HEXADECIMAL CONVERTER CODE

    // CUSTOM ENCODING BOX CODE
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
    var custom_bits_input = $("#custom_bits_input");
    var encodings_table = $("#encodings_table");

    $($("#bit_range").get(0)).slider().on('change', function(){
        $("#custom_encoding_num_bits").text(this.value);
        custom_encoding_num_bits = Number($("#custom_encoding_num_bits").text());
        $("#custom_bits_input").attr("placeholder", this.value + " BIT(s)");
        loadEncodingTable();
    });

    function clearEncodingTable(){
        for(var i = 1; i < encodings_table.children().length; i++){
            $(encodings_table.children()).get(i).remove();
        }
    }

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
            encodings_table.append("<tr><td>" + sorted_keys[j] +"</td><td>" + dict_to_load[sorted_keys[j].trim()] + "</td><td><button class='btn btn-warning'><i class='fas fa-times'></i></button></td></tr>");
            bindLastTRButton();
        }
    }

    $("#editor").bind("input", function(){
        updateEncodingOutputText();
    });

    function updateEncodingOutputText(){
        if(custom_encoding_format === indices.KEY_TO_VALUE){
            if(editor.getValue() !== null && editor.getValue() !== "")
            if(!BINARY_REGEX.test(editor.getValue().replace(/\s/gi, ""))){
                notify.err("You must enter valid binary digits (1 or 0) when in Key -> Value format");
                editor.setValue(editor.getValue().slice(0,editor.getValue().length-1));
            }else{
                var regex = getRegex();
                var keyList = editor.getValue().replace(/\s/gi,"").trim().match(regex);
                var strResult = "";
                if(keyList){
                    for(var i = 0; i < keyList.length; i++){
                        if(encodings[custom_encoding_num_bits]){
                            strResult += encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][keyList[i]];
                        }
                    }
                    strResult = strResult.replace(/undefined/g, "?".repeat(custom_encoding_num_bits));
                    $("#custom_encoding_output").text(strResult);
                }else $("#custom_encoding_output").text("");
            }
        }
        if(custom_encoding_format === indices.VALUE_TO_KEY){
            var valueList = editor.getValue().match(/.{1,1}/g);
            var result = "";
            if(valueList){
                for(var j = 0; j < valueList.length; j++){
                    if(encodings[custom_encoding_num_bits]){
                        result += encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][valueList[j]];
                    }
                }
                result = result.replace(/undefined/g, "?".repeat(custom_encoding_num_bits));
                $("#custom_encoding_output").text(result);
            }else $("#custom_encoding_output").text("");
        }
    }

    function getRegex(){
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

    $("#keyToValRadio").click(function(){
        custom_encoding_format = indices.KEY_TO_VALUE;
        editor.setValue("");
    });

    $("#valToKeyRadio").click(function(){
        custom_encoding_format = indices.VALUE_TO_KEY;
        editor.setValue("");
    });

    function setUpEditor() {
        window.editor = ace.edit("editor");
        editor.setOptions({
           fontSize: "10pt",
        });
        editor.setAutoScrollEditorIntoView(true);
        editor.setValue("");
        var keyboardHandler = {
            handleKeyboard: function(data,hash,keyString,keyCode,event){
                if(editor.getReadOnly()){
                    var input = String.fromCharCode(keyCode);
                    if(input.replace(/\s/gi,"") != "" && input != null){
                        notify.err("You must have keys and values set before entering text to the encoding area");
                    }
                }
                if(keyCode == 8){
                    var output = $("#custom_encoding_output");
                    if(output.text().replace(/\s/gi,"").trim().length === 1){
                        output.text("");
                    }
                    if(custom_encoding_format == indices.KEY_TO_VALUE){ //only subtract from string length - 2* custom encoding bit length if it is value to key
                        output.text(output.text().slice(0,output.text().length - 2));
                    }else{
                        output.text(output.text().slice(0,output.text().length-((2*custom_encoding_num_bits)-1)));
                    }
                }
                updateEncodingOutputText();
            }
        };
        editor.setReadOnly(true);
        editor.keyBinding.addKeyboardHandler(keyboardHandler);
        $("#editor").show();
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

    function bindLastTRButton(){
        $("#encodings_table button").last().click(function(){
            delete encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][$(this).closest("tr").find(".encoding").text().trim()];
            delete encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][$(this).closest("tr").find(".value").text().trim()];
            $(this).closest("tr").remove();
            if($("#encodings_table tr").length < 2){
                editor.setReadOnly(true);
            }
        });
    }

    $("#submit_encoding").click(function(){
        if(custom_bits_input.val().trim().length == custom_encoding_num_bits){
            var invalid_encoding = false;
            $("#encodings_table tr").each(function(){
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
            var val = custom_values_input.val().charAt(0) == " " ? "\" \"" : custom_values_input.val().charAt(0);
            encodings_table.append("<tr><td class='encoding'>" + custom_bits_input.val() + "</td><td class='value'>" + val + "</td><td><button class='deleteKeyValuePair btn btn-warning'><i class='fas fa-times'></i></button></td></tr>");
            bindLastTRButton();
            encodings[custom_encoding_num_bits][indices.KEY_TO_VALUE][custom_bits_input.val().trim()] = custom_values_input.val().charAt(0);
            encodings[custom_encoding_num_bits][indices.VALUE_TO_KEY][custom_values_input.val().charAt(0)] = custom_bits_input.val().trim();
            editor.setReadOnly(false);
        }else{
            notify.err("Your number of bits must match the bit length you set and you must have a value of length 1 for the encoding key");
        }
        custom_bits_input.val("");
        custom_values_input.val("");
    });

    $("#copy_encoding").click(function(){
        var encoding_output = $("#custom_encoding_output");
        encoding_output.select();
        document.execCommand("copy");
        notify.suc(encoding_output.val() + " copied to clipboard!");
    });

    $("#swap_encoding").click(function(){
        var encoding_output = $("#custom_encoding_output");
        var encoding_input = editor;
        if($("#valToKeyRadio").is(':checked')){
            custom_encoding_format = indices.KEY_TO_VALUE;
            $("#keyToValRadio").prop('checked', true);
        }else {
            custom_encoding_format = indices.VALUE_TO_KEY;
            $("#valToKeyRadio").prop('checked', true);
        }

        encoding_input.setValue(encoding_output.val());
    });

    // END CUSTOM ENCODING BOX CODE

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

});
