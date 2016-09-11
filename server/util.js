String.prototype.toBytes = function (){
  var arr = [];
  for (var i = 0; i < this.length; i++) {
    arr.push(this[i].charCodeAt(0))
  }
  return arr;
};

String.prototype.toUTF8Array = function () {
  var str = this;
  var utf8 = [];
  for (var i=0; i < str.length; i++) {
    var charcode = str.charCodeAt(i);
    if (charcode < 0x80) utf8.push(charcode);
    else if (charcode < 0x800) {
      utf8.push(0xc0 | (charcode >> 6),
        0x80 | (charcode & 0x3f));
    }
    else if (charcode < 0xd800 || charcode >= 0xe000) {
      utf8.push(0xe0 | (charcode >> 12),
        0x80 | ((charcode>>6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
    // surrogate pair
    else {
      i++;
      // UTF-16 encodes 0x10000-0x10FFFF by
      // subtracting 0x10000 and splitting the
      // 20 bits of 0x0-0xFFFFF into two halves
      charcode = 0x10000 + (((charcode & 0x3ff)<<10)
        | (str.charCodeAt(i) & 0x3ff));
      utf8.push(0xf0 | (charcode >>18),
        0x80 | ((charcode>>12) & 0x3f),
        0x80 | ((charcode>>6) & 0x3f),
        0x80 | (charcode & 0x3f));
    }
  }
  return utf8;
}

String.prototype.escapeUnicode = function(){
  var str = this;
  str = str.replace(/�|�|?|?|�|�|?|?|?|?|?|?|?|?|?|?|?/g, "a");
  str = str.replace(/�|�|?|?|�|�|?|?|?|?|?|?|?|?|?|?|?/g, "A");
  str = str.replace(/�|�|?|?|?|�|?|?|?|?|?/g, "e");
  str = str.replace(/�|�|?|?|?|�|?|?|?|?|?/g, "E");
  str = str.replace(/�|�|?|?|?/g, "i");
  str = str.replace(/�|�|?|?|?/g, "I");
  str = str.replace(/�|�|?|?|�|�|?|?|?|?|?|?|?|?|?|?|?/g, "o");
  str = str.replace(/�|�|?|?|�|�|?|?|?|?|?|?|?|?|?|?|?/g, "O");
  str = str.replace(/�|�|?|?|?|?|?|?|?|?|?/g, "u");
  str = str.replace(/�|�|?|?|?|?|?|?|?|?|?/g, "U");
  str = str.replace(/?|�|?|?|?/g, "y");
  str = str.replace(/?|�|?|?|?/g, "Y");
  str = str.replace(/?/g, "d");
  str = str.replace(/?/g, "?");
  //str = str.replace(/!|@|\$|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\'| |\"|\&|\#|\[|\]|~/g, " ");
  //str = str.replace(/-+-/g, " ");
  //str = str.replace(/^\-+|\-+$/g, "");
  return str;
}