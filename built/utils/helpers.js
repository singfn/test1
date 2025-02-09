"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wsToToken = exports.tokenToWs = exports.createView = exports.murmur2 = exports.shiftMessage = exports.shiftKey = exports.roundRect = exports.rgbToStringHex = exports.getColor = exports.getColorLighten = exports.createTokens = exports.transformMinimapLocation = void 0;
var pixi_js_1 = require("pixi.js");
var transformMinimapLocation = function (location, mapOffsets, settings, shift) {
    var size = settings.all.settings.theming.minimap.size;
    var offsetX = !shift ? mapOffsets.minX : -mapOffsets.width / 2;
    var offsetY = !shift ? mapOffsets.minY : -mapOffsets.height / 2;
    return {
        x: (location.x - offsetX) / mapOffsets.width * size,
        y: (location.y - offsetY) / mapOffsets.height * size,
        r: location.r / mapOffsets.width * size
    };
};
exports.transformMinimapLocation = transformMinimapLocation;
var createTokens = function (party, server) {
    if (!party && !server) {
        return '';
    }
    if (party) {
        return party + "%" + server;
    }
    else {
        return "%" + server;
    }
};
exports.createTokens = createTokens;
var getColorLighten = function (lighten, _a) {
    var red = _a.red, green = _a.green, blue = _a.blue;
    var r = Math.min(lighten / red, 1);
    var g = Math.min(lighten / green, 1);
    var b = Math.min(lighten / blue, 1);
    return pixi_js_1.utils.rgb2hex([r, g, b]);
};
exports.getColorLighten = getColorLighten;
var getColor = function (_a) {
    var red = _a.red, green = _a.green, blue = _a.blue;
    var r = red / 255;
    var g = green / 255;
    var b = blue / 255;
    return pixi_js_1.utils.rgb2hex([r, g, b]);
};
exports.getColor = getColor;
var componentToHex = function (c) {
    var hex = c ? c.toString(16) : '';
    return hex.length == 1 ? "0" + hex : hex;
};
var rgbToStringHex = function (_a) {
    var red = _a.red, green = _a.green, blue = _a.blue;
    return "#" + componentToHex(red) + componentToHex(green) + componentToHex(blue);
};
exports.rgbToStringHex = rgbToStringHex;
var roundRect = function (ctx, x, y, width, height, r) {
    var radius = {
        tl: r,
        tr: r,
        br: r,
        bl: r
    };
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
};
exports.roundRect = roundRect;
/* eslint-disable */
var shiftKey = function (key) {
    return key = 0 | Math.imul(key, 1540483477),
        key = 114296087 ^ (0 | Math.imul(key >>> 24 ^ key, 1540483477)),
        (key = 0 | Math.imul(key >>> 13 ^ key, 1540483477)) >>> 15 ^ key;
};
exports.shiftKey = shiftKey;
var shiftMessage = function (view, key) {
    for (var i = 0; i < view.byteLength; i++)
        view.setUint8(i, view.getUint8(i) ^ key >>> i % 4 * 8 & 255);
    return view;
};
exports.shiftMessage = shiftMessage;
var murmur2 = function (e, t) {
    var i = e.length;
    t ^= i;
    for (var n, o = 0; 4 <= i;)
        n = 1540483477 * (65535 & (n = 255 & e.charCodeAt(o) | (255 & e.charCodeAt(++o)) << 8 | (255 & e.charCodeAt(++o)) << 16 | (255 & e.charCodeAt(++o)) << 24)) + ((1540483477 * (n >>> 16) & 65535) << 16), t = 1540483477 * (65535 & t) + ((1540483477 * (t >>> 16) & 65535) << 16) ^ (n = 1540483477 * (65535 & (n ^= n >>> 24)) + ((1540483477 * (n >>> 16) & 65535) << 16)), i -= 4, ++o;
    switch (i) {
        case 3:
            t ^= (255 & e.charCodeAt(o + 2)) << 16;
        case 2:
            t ^= (255 & e.charCodeAt(o + 1)) << 8;
        case 1:
            t = 1540483477 * (65535 & (t ^= 255 & e.charCodeAt(o))) + ((1540483477 * (t >>> 16) & 65535) << 16);
    }
    return ((t = 1540483477 * (65535 & (t ^= t >>> 13)) + ((1540483477 * (t >>> 16) & 65535) << 16)) ^ t >>> 15) >>> 0;
};
exports.murmur2 = murmur2;
var createView = function (value) {
    return new DataView(new ArrayBuffer(value));
};
exports.createView = createView;
var tokenToWs = function (token) {
    if (!token) {
        return null;
    }
    var ws = null;
    if (!ws && /^[a-z0-9]{5,}\.tech$/.test(token)) {
        ws = "wss://live-arena-" + token + ".agar.io:80";
    }
    if (/^[a-zA-Z0-9=+/]{12,}$/.test(token)) {
        var atobToken = atob(token);
        //ccse
        if (!ws && atobToken.search(/agar\.io/) == -1) {
            ws = 'wss://' + atobToken;
            return ws;
        }
        if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/.test(atobToken)) {
            ws = "wss://ip-" + atobToken.replace(/./g, '-').replace(':', ".tech.agar.io:");
        }
    }
    if (!ws && /^[a-z0-9]{5,}$/.test(token)) {
        ws = "wss://live-arena-" + token + ".agar.io:443";
    }
    return ws;
};
exports.tokenToWs = tokenToWs;
var wsToToken = function (_ws) {
    var serverToken = '';
    var serverIP = '';
    var matchOld = _ws.match(/ip-\d+/);
    var matchNew = _ws.match(/live-arena-([\w\d]+)/);
    var matchNew2 = _ws.match(/live-arena-(.+\.tech)/);
    var text = null;
    if (matchOld) {
        var replace = _ws.replace(".tech.agar.io", '').replace(/-/g, '.');
        matchOld = replace.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,4}/);
        if (matchOld) {
            serverIP = matchOld[0];
            text = btoa(serverIP);
        }
    }
    if (matchNew2 && matchNew2[1]) { //wss://live-arena-19bre41.tech.agar.io:80
        var replace = matchNew2[1];
        text = replace;
    }
    //ccse
    if (_ws.search(/wss?:\/\//) > -1 && _ws.search(/agar\.io/) == -1) {
        text = _ws.match(/wss?:\/\/(.+)/)[1];
        serverIP = text;
        text = btoa(text);
    }
    if (!text && matchNew) {
        text = matchNew[1];
    }
    if (text) {
        if (serverToken !== text) {
            serverToken = text;
        }
        /*this.server.partyToken = '';
        const matchPartyId = _ws.match(/party_id=([A-Z0-9]{6})/);
        if (matchPartyId) {
            this.server.partyToken = matchPartyId[1];
            master.setURL('/#' + window.encodeURIComponent(this.server.partyToken))
        }*/
        return text;
    }
    return 'EWTT' + Math.random();
};
exports.wsToToken = wsToToken;
