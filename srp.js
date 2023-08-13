function Uint8ArraySubstr(array, st, len) {
    var ret = new Uint8Array(len);
    for (var i = 0; i < len; i++) ret[i] = array[st + i];
    return ret;
} 

function Uint8ArrayToString(array) {
    var ret = "";
    for (var i = 0; i < array.length; i++) ret += String.fromCharCode(array[i]);
    return ret;
}

class srp {
    fileNumber = 0;
    files = {}; jsons = [];

    constructor(context) {
        if (context == undefined) {
            this.fileNumber = 0;
            this.files = {}; this.jsons = [];
            return;
        } if (!(context instanceof Uint8Array)) throw new Error("Please use srp(context: Uint8Array) to construct a srp class.");
        if (Uint8ArrayToString(Uint8ArraySubstr(context, 0, 4)) != ".srp") throw new Error("Invalid srp file.");
        var pt = 4; this.fileNumber = 0; this.files = {};
        for (var i = 0; i < 8; i++) this.fileNumber <<= 8, this.fileNumber += context[pt++];
        for (var i = 0; i < this.fileNumber; i++) {
            var sha1 = "", size = 0;
            for (var j = 0; j < 20; j++) sha1 += context[pt++].toString(16).padStart(2, "0");
            for (var j = 0; j < 8; j++) size <<= 8, size += context[pt++];
            var content = new Uint8Array(size);
            for (var j = 0; j < size; j++) content[j] = context[pt++];
            // 哈希查验
            var sha1Real = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(content)).toString();
            if (sha1Real != sha1) throw new Error("Invalid srp file.");
            this.files[sha1] = content;
        } var jsonNumber = 0;
        for (var i = 0; i < 8; i++) jsonNumber <<= 8, jsonNumber += context[pt++];
        for (var i = 0; i < jsonNumber; i++) {
            var type = "", size = 0;
            type = String.fromCharCode(context[pt++]);
            for (var j = 0; j < 8; j++) size <<= 8, size += context[pt++];
            var content = new Uint8Array(size);
            for (var j = 0; j < size; j++) content[j] = context[pt++];
            this.jsons.push({ type: type, content: (new TextDecoder("utf-8")).decode(content) });
        }
    }

    addFile(content) {
        if (!(content instanceof Uint8Array)) throw new Error("Please use Uint8Array to add a file.");
        var sha1 = CryptoJS.SHA1(CryptoJS.lib.WordArray.create(content)).toString();
        this.files[sha1] = content; this.fileNumber++;
        return sha1;
    }

    addJson(type, content) {
        if (typeof content != "string") throw new Error("A json must be a string.");
        this.jsons.push({ type: type, content: content });
    }

    toUint8Array() {
        this.fileNumber = 0;
        for (var sha1 in this.files) this.fileNumber++;
        var pt = 0; var len = 4 + 8 + 28 * this.fileNumber + 8 + 9 * this.jsons.length;
        for (var sha1 in this.files) len += this.files[sha1].length;
        for (var i = 0; i < this.jsons.length; i++) len += (new TextEncoder("utf-8")).encode(this.jsons[i].content).length;
        var ret = new Uint8Array(len), x = new Uint8Array(8); len = this.fileNumber;
        ret[pt++] = 0x2e; ret[pt++] = 0x73; ret[pt++] = 0x72; ret[pt++] = 0x70;
        for (var i = 0; i < 8; i++) x[i] = len % 256, len /= 256, len = Math.floor(len);
        for (var i = 0; i < 8; i++) ret[pt++] = x[7 - i];
        for (var sha1 in this.files) {
            var content = this.files[sha1]; var x = new Uint8Array(8); var len = content.length;
            for (var j = 0; j < 20; j++) ret[pt++] = parseInt(sha1.substr(j * 2, 2), 16);
            for (var j = 0; j < 8; j++) x[j] = len % 256, len /= 256, len = Math.floor(len);
            for (var j = 0; j < 8; j++) ret[pt++] = x[7 - j];
            for (var j = 0; j < content.length; j++) ret[pt++] = content[j];
        } len = this.jsons.length;
        for (var i = 0; i < 8; i++) x[i] = len % 256, len /= 256, len = Math.floor(len);
        for (var i = 0; i < 8; i++) ret[pt++] = x[7 - i];
        for (var i = 0; i < this.jsons.length; i++) {
            var json = this.jsons[i], x = new Uint8Array(8); 
            var len = (new TextEncoder("utf-8")).encode(json.content).length
            ret[pt++] = json.type.charCodeAt(0);
            for (var j = 0; j < 8; j++) x[j] = len % 256, len /= 256, len = Math.floor(len);
            for (var j = 0; j < 8; j++) ret[pt++] = x[7 - j];
            var content = (new TextEncoder("utf-8")).encode(json.content);
            for (var j = 0; j < content.length; j++) ret[pt++] = content[j];
        } return ret;
    }
};