"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var FrontAPI_1 = __importDefault(require("../communication/FrontAPI"));
var Receiver = /** @class */ (function () {
    function Receiver(socket) {
        this.socket = socket;
    }
    Receiver.prototype.getChatMessage = function (reader) {
        if (this.socket.second) {
            return;
        }
        var messageType = reader.getUint8();
        var playerID = reader.getUint32();
        reader.shiftOffset(4);
        var arr = reader.readUTF16string().split(': ');
        var author = arr[0];
        var message = arr[1];
        FrontAPI_1.default.sendChatMessage(author, message, messageType == 102 ? 'COMMAND' : 'PLAYER');
    };
    Receiver.prototype.updateTeamPlayer = function (reader) {
        if (this.socket.second) {
            return;
        }
        var id = reader.getUint32();
        var player = this.socket.add(id);
        player.nick = reader.readUTF16string().trim();
        player.skin = reader.readUTF16string();
        player.color = {
            custom: reader.readUTF16string(),
            cell: reader.readUTF16string(),
        };
    };
    Receiver.prototype.updateTeamPlayerPosition = function (reader) {
        if (this.socket.second) {
            return;
        }
        var id = reader.getUint32();
        var player = this.socket.add(id);
        player.position = {
            x: reader.getInt32(),
            y: reader.getInt32(),
        };
        player.mass = reader.getUint32();
        player.alive = true;
        player.updateTime = Date.now();
    };
    return Receiver;
}());
exports.default = Receiver;
