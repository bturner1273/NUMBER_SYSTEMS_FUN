var convertor_test = (function () {
    var text_to_bin, text_to_hex, bin_to_text, hex_to_text,
        text_to_bin_tests,
        tester, init;

    // TODO get func from /assets/js/script.js
    text_to_bin = function (s, separator) {
        var rst = []
        if (s === undefined)
            s = ""

        for (var i = 0; i < s.length; i++) {
            var char = s[i].charCodeAt(0).toString(2);
            if (char.length < 8) {
                rst.push("0".repeat(8 - char.length) + char);
            } else {
                rst.push(char);
            }
        }
        if (separator === undefined)
            separator = ""
        return rst.join(separator);
    }

    text_to_hex = function (s, separator) {
        var rst = []
        if (s === undefined)
            s = ""

        for (var i = 0; i < s.length; i++) {
            var char = s[i].charCodeAt(0).toString(16);
            if (char.length < 2) {
                rst.push("0".repeat(2 - char.length) + char);
            } else {
                rst.push(char);
            }
        }
        if (separator === undefined)
            separator = ""
        return rst.join(separator);
    }

    bin_to_text = function (inp) {

    }

    hex_to_text = function (inp) {

    }

    // tester function
    tester = function (func, test_cases) {
        var num_test_case = test_cases.length,
            num_passed_test_case = 0,
            err_msg = [];

        for (var idx = 0; idx < num_test_case; idx++) {
            var input, expected_rst, actual_rst;
            [input, expected_rst] = test_cases[idx]

            if (Array.isArray(input)) {
                actual_rst = func.apply(null, input)
            } else {
                actual_rst = func(input)
            }

            if (actual_rst !== expected_rst) {
                err_msg.push("   Input: " + input + "\nExpected: "
                             + expected_rst + "\n  Actual: " + actual_rst);
            } else {
                num_passed_test_case += 1;
            }
        }

        return {
            "total": num_test_case,
            "passed": num_passed_test_case,
            "err_msg": err_msg,
        }
    }

    // test cases
    // item format:
    // [input_str, expected_str] // or [[param1, param2, param3], expected_str]
    // Note:
    // use charset="utf-8" to support multiple languages input
    text_to_bin_tests = [
        ["", ""],
        [undefined, ""],
        [" ", "00100000"],
        ["-", "00101101"],
        ["!@#$%^&*()_+|~", "0010000101000000001000110010010000100101010111100010011000101010001010000010100101011111001010110111110001111110"],
        ["{}:\"<>?1234567890-=\\`", "011110110111110100111010001000100011110000111110001111110011000100110010001100110011010000110101001101100011011100111000001110010011000000101101001111010101110001100000"],
        ["\n", "00001010"],
        ["12\nyou", "001100010011001000001010011110010110111101110101"],
        [["12\nyou", " "], "00110001 00110010 00001010 01111001 01101111 01110101"],
        ["\t", "00001001"],
        ["哈哈", "101010011001000101010011001000"],
        [["哈哈", " "], "101010011001000 101010011001000"],
        ["점심 식사", "110010000001000011000010111011000010000011000010110111011100000010101100"],
        ["ビール", "110000110100111100001111110011000011101011"],
        ["😀", "11011000001111011101111000000000"],
        [["😛😧👨‍👨‍👧‍👦", " "], "1101100000111101 1101111000011011 1101100000111101 1101111000100111 1101100000111101 1101110001101000 10000000001101 1101100000111101 1101110001101000 10000000001101 1101100000111101 1101110001100111 10000000001101 1101100000111101 1101110001100110"],
        [97531, ""],
        [-1, ""],
        ["97531", "0011100100110111001101010011001100110001"],
        ["-1", "0010110100110001"],
        ["hello", "0110100001100101011011000110110001101111"],
        [["QWERTYUIOPASDFGHJKLZXCVBNM", " "], "01010001 01010111 01000101 01010010 01010100 01011001 01010101 01001001 01001111 01010000 01000001 01010011 01000100 01000110 01000111 01001000 01001010 01001011 01001100 01011010 01011000 01000011 01010110 01000010 01001110 01001101"],
        [["oyoclass Code|Make|Own", " "], "01101111 01111001 01101111 01100011 01101100 01100001 01110011 01110011 00100000 01000011 01101111 01100100 01100101 01111100 01001101 01100001 01101011 01100101 01111100 01001111 01110111 01101110"],
        [["hello", " "], "01101000 01100101 01101100 01101100 01101111"],
    ]

    text_to_hex_tests = [
        ["", ""],
        [undefined, ""],
        [" ", "20"],
        ["-", "2d"],
        ["!@#$%^&*()_+|~", "21402324255e262a28295f2b7c7e"],
        ["{}:\"<>?1234567890-=\\`", "7b7d3a223c3e3f313233343536373839302d3d5c60"],
        ["\n", "0a"],
        ["12\nyou", "31320a796f75"],
        [["12\nyou", " "], "31 32 0a 79 6f 75"],
        ["\t", "09"],
        ["哈哈", "54c854c8"],
        ["점심 식사", "c810c2ec20c2ddc0ac"],
        ["ビール", "30d330fc30eb"],
        ["😀", "d83dde00"],
        ["😛😧👨‍👨‍👧‍👦", "d83dde1bd83dde27d83ddc68200dd83ddc68200dd83ddc67200dd83ddc66"],
        [97531, ""],
        [-1, ""],
        ["97531", "3937353331"],
        ["-1", "2d31"],
        ["hello", "68656c6c6f"],
        ["QWERTYUIOPASDFGHJKLZXCVBNM", "51574552545955494f504153444647484a4b4c5a584356424e4d"],
        ["oyoclass Code|Make|Own", "6f796f636c61737320436f64657c4d616b657c4f776e"],
        [["hello", " "], "68 65 6c 6c 6f"],
    ]

    // init function, render page
    init = function (s2b, s2h) {
        // var msg_container = document.getElementById("msg_container"),
        var msg_container = document.body,
            tests = [
                ["Text to Binary", text_to_bin, text_to_bin_tests],
                ["Text to Hex", text_to_hex, text_to_hex_tests]
                // [description, function]
            ]

        for (var idx = 0; idx < tests.length; idx++) {
            var msg_div = document.createElement('div'),
                desc, func, test_cases, rst, text_color;

            [desc, func, test_cases] = tests[idx]
            rst = tester(func, test_cases);
            text_color = rst.passed == rst.total ? "green" : "red";

            msg_div.innerHTML = "<h3 style='color:" + text_color + "'>"
                            + rst.passed + "/" + rst.total + " " + desc
                            + "</h3>\n<pre>"
                            + rst.err_msg.join("\n\n") + "</pre>"
            msg_container.appendChild(msg_div)
        }
    }

    return {
        init: init
    }
})();
