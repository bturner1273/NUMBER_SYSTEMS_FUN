$(function(){
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
                if(!BINARY_REGEX.test($("#input_text_area").val().trim())){
                    alert("You must write valid binary if you choose to use it as your input format (1 and 0 only)");
                    $("#input_text_area").val("");
                }
            }
            if(input_format === format.HEXADECIMAL){
                if(!HEXADECIMAL_REGEX.test($("#input_text_area").val().trim())){
                    alert("You must write valid hex if you choose to use it as your input format (0-9, a-f, and A-F only)");
                    $("#input_text_area").val("");
                }
            }
            if(input_format === output_format){
                output_text_area.val($("#input_text_area").val());
            }
            if(input_format === format.BINARY && output_format === format.HEXADECIMAL){
                output_text_area.val(parseInt(Number($("#input_text_area").val()), 2).toString(16).toUpperCase());
            }
            if(input_format === format.HEXADECIMAL && output_format === format.BINARY){
                output_text_area.val(parseInt($("#input_text_area").val(), 16).toString(2));
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
        var list = $("#input_text_area").val().trim().match(/.{1,7}/g);
        var toReturn = "";
        for(var i = 0; i < list.length; i++){
            toReturn += String.fromCharCode(parseInt(Number(list[i]), 2).toString(10)) + " ";
        }
        return toReturn;
    }

    function base16_to_ascii(){
        var list = $("#input_text_area").val().trim().match(/.{1,2}/g);
        var toReturn = "";
        for(var i = 0; i < list.length; i++){
            toReturn += String.fromCharCode(parseInt(list[i], 16).toString(10)) + " ";
        }
        return toReturn;
    }

    function ascii_to_base(base){
        $("#output_text_area").val("");
        var input_val = $("#input_text_area").val().trim();
        var toReturn = "";
        for(var i = 0; i < input_val.length; i++){
            toReturn += input_val[i].charCodeAt(0).toString(base) + " ";
        }
        return toReturn;
    }

    function bind_radios_labels_foolproof(_class, slice_start, slice_end){
        $('input[type=radio]').slice(slice_start, slice_end).change(function () {
            $("#output_text_area").val("");
            var enum_lookup_string;
              switch($(this).val()){
                  case "1":
                        enum_lookup_string = "BINARY";
                        $(_class).html(enum_lookup_string);
                        break;
                  case "2":
                        enum_lookup_string = "HEXADECIMAL";
                        $(_class).html(enum_lookup_string);
                        break;
                  default:
                        enum_lookup_string = "ASCII";
                        $(_class).html(enum_lookup_string);
                        break;
              }
              if(slice_end <= 3){
                  input_format = format[enum_lookup_string];
              }else {
                  output_format = format[enum_lookup_string];
                  $("#input_text_area").trigger("input");
              }
        });
    }

});
