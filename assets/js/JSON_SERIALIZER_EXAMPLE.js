var dict = {
    brad: 1,
    mike: 1,
    jynx: 1
}
var encoded = encodeURIComponent(window.btoa(JSON.stringify(dict)));
var decoded = JSON.parse(window.atob(decodeURIComponent(encoded)));

console.log("base64 string: " + encoded);
console.log("decoded object: " , decoded);
