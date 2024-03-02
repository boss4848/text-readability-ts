var charmap = require('./charmap.json');

function normalize(str, custom_charmap) {
  var current_charmap = custom_charmap || charmap;
  var regex = buildRegExp(current_charmap);

  return str.replace(regex, function (charToReplace) {
    return charmap[charToReplace.charCodeAt(0)] || charToReplace;
  });
}

function buildRegExp(charmap) {
  return new RegExp('[' + Object.keys(charmap).map(function (code) { return String.fromCharCode(code); }).join(' ') + ']', 'g');
}

module.exports = normalize;