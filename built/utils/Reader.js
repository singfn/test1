"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Reader = /** @class */ (function () {
    function Reader(value, ab) {
        if (value) {
            if (ab) {
                this.view = new DataView(value);
            }
            else {
                this.view = value;
            }
            this.offset = 0;
        }
    }
    Reader.prototype.setView = function (view) {
        this.offset = 0;
        this.view = view;
    };
    Reader.prototype.endOfBuffer = function () {
        return this.offset >= this.view.byteLength;
    };
    Reader.prototype.shiftOffset = function (number) {
        this.offset += number;
    };
    Reader.prototype.getUint8 = function () {
        return this.view.getUint8(this.offset++);
    };
    Reader.prototype.getInt8 = function () {
        return this.view.getInt8(this.offset++);
    };
    Reader.prototype.getUint16 = function () {
        return this.view.getUint16((this.offset += 2) - 2, true);
    };
    Reader.prototype.getInt16 = function () {
        return this.view.getInt16((this.offset += 2) - 2, true);
    };
    Reader.prototype.getUint32 = function () {
        return this.view.getUint32((this.offset += 4) - 4, true);
    };
    Reader.prototype.getInt32 = function () {
        return this.view.getInt32((this.offset += 4) - 4, true);
    };
    Reader.prototype.getFloat32 = function () {
        return this.view.getFloat32((this.offset += 4) - 4, true);
    };
    Reader.prototype.getFloat64 = function () {
        return this.view.getFloat64((this.offset += 8) - 8, true);
    };
    Reader.prototype.getStringUTF8 = function () {
        var string = "";
        var byte;
        while ((byte = this.view.getUint8(this.offset++)) !== 0) {
            string += String.fromCharCode(byte);
        }
        return decodeURIComponent(escape(string));
    };
    Reader.prototype.readUTF16string = function () {
        var ue = "";
        for (; !this.endOfBuffer();) {
            var fe = this.getUint16();
            if (0 === fe) {
                break;
            }
            ue += String.fromCharCode(fe);
        }
        return ue;
    };
    Reader.prototype.decompressMessage = function () {
        var messageBuffer = Buffer.from(this.view.buffer);
        var readMessage = Buffer.alloc(messageBuffer.readUInt32LE(1));
        this.uncompressBlock(messageBuffer.slice(5), readMessage);
        this.setView(new DataView(readMessage.buffer));
    };
    Reader.prototype.copy = function (dest, src, di, si, len) {
        for (var i = 0; i < len; ++i) {
            dest[di++] = src[si++];
        }
    };
    Reader.prototype.uncompressBlock = function (src, dest) {
        var sn = src.length;
        var dn = dest.length;
        if (sn === 0) {
            return;
        }
        for (var si = 0, di = 0;;) {
            var lLen = src[si] >> 4;
            var mLen = src[si] & 0xf;
            if (++si === sn) {
                throw new Error("Invalid source");
            }
            if (lLen > 0) {
                if (lLen === 0xf) {
                    while (src[si] === 0xff) {
                        lLen += 0xff;
                        if (++si === sn) {
                            throw new Error("Invalid source");
                        }
                    }
                    lLen += src[si];
                    if (++si === sn) {
                        throw new Error("Invalid source");
                    }
                }
                if (dn - di < lLen || si + lLen > sn) {
                    throw new Error("Short buffer");
                }
                this.copy(dest, src, di, si, lLen);
                di += lLen;
                si += lLen;
                if (si >= sn) {
                    return;
                }
            }
            si += 2;
            if (si >= sn) {
                throw new Error("Invalid source");
            }
            var offset = src[si - 2] | (src[si - 1] << 8);
            if (di - offset < 0 || offset === 0) {
                throw new Error("Invalid source");
            }
            if (mLen === 0xf) {
                while (src[si] === 0xff) {
                    mLen += 0xff;
                    if (++si === sn) {
                        throw new Error("Invalid source");
                    }
                }
                mLen += src[si];
                if (++si === sn) {
                    throw new Error("Invalid source");
                }
            }
            mLen += 4;
            if (dn - di <= mLen) {
                throw new Error("Short buffer");
            }
            for (; mLen >= offset; mLen -= offset) {
                this.copy(dest, dest, di, di - offset, offset);
                di += offset;
            }
            this.copy(dest, dest, di, di - offset, mLen);
            di += mLen;
        }
    };
    return Reader;
}());
exports.default = Reader;
