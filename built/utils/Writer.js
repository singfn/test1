"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Writer = /** @class */ (function () {
    function Writer(size) {
        this.message = Buffer.alloc(size);
        this.offset = 0;
    }
    Object.defineProperty(Writer.prototype, "buffer", {
        get: function () {
            return this.message.buffer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Writer.prototype, "dataView", {
        get: function () {
            return new DataView(this.buffer);
        },
        enumerable: false,
        configurable: true
    });
    Writer.prototype.setToArray = function () {
        this.message = [];
    };
    Writer.prototype.writeUInt8 = function (value) {
        this.message.writeUInt8(value, this.offset++);
    };
    Writer.prototype.writeInt8 = function (value) {
        this.message.writeInt8(value, this.offset++);
    };
    Writer.prototype.writeUInt16 = function (value) {
        this.message.writeUInt16LE(value, this.offset);
        this.offset += 2;
    };
    Writer.prototype.writeInt16 = function (value) {
        this.message.writeInt16LE(value, this.offset);
        this.offset += 2;
    };
    Writer.prototype.writeUInt24 = function (value) {
        this.message.writeUIntLE(value, this.offset, 3);
        this.offset += 3;
    };
    Writer.prototype.writeInt24 = function (value) {
        this.message.writeIntLE(value, this.offset, 3);
        this.offset += 3;
    };
    Writer.prototype.writeUInt32 = function (value) {
        this.message.writeUInt32LE(value, this.offset);
        this.offset += 4;
    };
    Writer.prototype.writeInt32 = function (value) {
        this.message.writeInt32LE(value, this.offset);
        this.offset += 4;
    };
    Writer.prototype.writeString = function (msg) {
        for (var i = 0; i < msg.length; i++) {
            this.writeUInt8(msg.charCodeAt(i));
        }
        this.writeUInt8(0);
    };
    Writer.prototype.writeString16 = function (msg) {
        for (var i = 0; i < msg.length; i++) {
            this.writeUInt16(msg.charCodeAt(i));
        }
        this.writeUInt16(0);
    };
    Writer.prototype.writeBytes = function (bytes) {
        var _a;
        (_a = this.message).push.apply(_a, __spreadArray([], __read(bytes)));
    };
    Writer.prototype.writeUint32InLEB128 = function (value) {
        while (true) {
            if ((value & -128) === 0) {
                this.message.push(value);
                break;
            }
            else {
                this.message.push(value & 127 | 128);
                value >>>= 7;
            }
        }
    };
    return Writer;
}());
exports.default = Writer;
