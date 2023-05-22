"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var telegraf_1 = require("telegraf");
var axios_1 = require("axios");
// Здесь необходимо вставить токен вашего бота
var botToken = "TOKEN";
// Здесь необходимо указать ID двух каналов
var channel1Id = -1001334934580;
var channel2Id = -1001763525815;
// Создание экземпляра бота
var bot = new telegraf_1.Telegraf(botToken);
var delay = 900000; // 900000 - 15 min
var editTime = 60000; // 1 min
var timeCheck = 0;
function sleep(ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
}
function runBot() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // Запуск бота
                    bot.launch();
                    console.log('Бот запущен');
                    // Ожидание некоторого времени
                    return [4 /*yield*/, sleep(5000)];
                case 1:
                    // Ожидание некоторого времени
                    _a.sent();
                    // Остановка бота
                    return [4 /*yield*/, bot.stop()];
                case 2:
                    // Остановка бота
                    _a.sent();
                    console.log('Бот остановлен');
                    return [2 /*return*/];
            }
        });
    });
}
// Функция для пересылки сообщений из канала №1 в канал №2
function copyMessages(readyMediaCopyMessages) {
    return __awaiter(this, void 0, void 0, function () {
        var i, cell, response, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 1;
                    _a.label = 1;
                case 1:
                    if (!(i <= readyMediaCopyMessages.length - 1)) return [3 /*break*/, 7];
                    return [4 /*yield*/, sleep(delay)];
                case 2:
                    _a.sent();
                    cell = readyMediaCopyMessages[i];
                    if (!(typeof cell === "number")) return [3 /*break*/, 4];
                    return [4 /*yield*/, axios_1.default.post("https://api.telegram.org/bot".concat(botToken, "/copyMessage"), {
                            chat_id: channel2Id,
                            from_chat_id: channel1Id,
                            message_id: readyMediaCopyMessages[i],
                        })];
                case 3:
                    response = _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, axios_1.default.post("https://api.telegram.org/bot".concat(botToken, "/sendMediaGroup"), {
                        chat_id: channel2Id,
                        media: readyMediaCopyMessages[i],
                    })];
                case 5:
                    response = _a.sent();
                    _a.label = 6;
                case 6:
                    i++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function result() {
    return __awaiter(this, void 0, void 0, function () {
        var response, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, axios_1.default.post("https://api.telegram.org/bot".concat(botToken, "/getUpdates"))];
                case 1:
                    response = _a.sent();
                    result = response.data.result;
                    return [2 /*return*/, result.length];
            }
        });
    });
}
// Функция для пересылки сообщений из канала №1 в канал №2
function update() {
    return __awaiter(this, void 0, void 0, function () {
        var mediaGroupId, readyMedia, tempMedia, editDate, response, result, channelPost, i, n, newMedia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    mediaGroupId = "0";
                    readyMedia = [[0]];
                    tempMedia = [];
                    editDate = 0;
                    return [4 /*yield*/, axios_1.default.post("https://api.telegram.org/bot".concat(botToken, "/getUpdates"))];
                case 1:
                    response = _a.sent();
                    result = response.data.result;
                    if (result.length == 0) {
                        return [2 /*return*/, readyMedia];
                    }
                    channelPost = [];
                    for (i = 0; i < result.length; i++) {
                        if (result[i].channel_post) {
                            channelPost.push(result[i].channel_post);
                        }
                        if (result[i].edited_channel_post) {
                            channelPost.push(result[i].edited_channel_post);
                        }
                    }
                    channelPost.sort(function (a, b) { return a.date - b.date; });
                    for (n = 0; n <= channelPost.length - 1; n++) {
                        if (channelPost[n].chat.id == channel1Id && channelPost[n].date > timeCheck) {
                            if (channelPost[n].media_group_id) {
                                if (mediaGroupId != channelPost[n].media_group_id) {
                                    mediaGroupId = channelPost[n].media_group_id;
                                    if (tempMedia.length != 0) {
                                        readyMedia.splice(readyMedia.length, 1, tempMedia);
                                        tempMedia = [];
                                    }
                                }
                                newMedia = {
                                    type: "photo",
                                    media: channelPost[n].photo[0].file_id,
                                    caption: channelPost[n].caption,
                                    caption_entities: channelPost[n].caption_entities,
                                };
                                if (channelPost[n].edit_date !== undefined && channelPost[n].edit_date > editDate) {
                                    tempMedia.pop();
                                    tempMedia.push(newMedia);
                                    editDate = channelPost[n].edit_date;
                                }
                                else {
                                    tempMedia.push(newMedia);
                                }
                            }
                            else {
                                if (tempMedia.length != 0) {
                                    readyMedia.splice(readyMedia.length, 1, tempMedia);
                                    tempMedia = [];
                                }
                                if (channelPost[n].edit_date !== undefined && channelPost[n].edit_date > editDate) {
                                    readyMedia.pop();
                                    readyMedia.push(channelPost[n].message_id);
                                    editDate = channelPost[n].edit_date;
                                }
                                else {
                                    readyMedia.push(channelPost[n].message_id);
                                }
                            }
                        }
                    }
                    if (tempMedia.length != 0) {
                        readyMedia.splice(readyMedia.length, 1, tempMedia);
                        tempMedia = [];
                    }
                    return [2 /*return*/, readyMedia];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var resultLength, readyMedia;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 7];
                    return [4 /*yield*/, result()];
                case 1:
                    resultLength = _a.sent();
                    return [4 /*yield*/, update()];
                case 2:
                    readyMedia = _a.sent();
                    timeCheck = Date.now();
                    console.log("timeCheck = ".concat(timeCheck));
                    if (!(resultLength == 0)) return [3 /*break*/, 4];
                    console.log("\u041F\u043E\u0441\u0442\u043E\u0432 \u0435\u0449\u0451 \u043D\u0435\u0442, \u043F\u0435\u0440\u0435\u0437\u0430\u043F\u0443\u0441\u043A \u0447\u0435\u0440\u0435\u0437 1 \u043C\u0438\u043D\u0443\u0442\u0443!");
                    return [4 /*yield*/, sleep(editTime)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    runBot().catch(function (err) { return console.error(err); });
                    return [4 /*yield*/, copyMessages(readyMedia)];
                case 5:
                    _a.sent();
                    console.log("\u0410\u0432\u0442\u043E\u043F\u043E\u0441\u0442\u0438\u043D\u0433 \u0437\u0430\u0432\u0435\u0440\u0448\u0451\u043D!");
                    _a.label = 6;
                case 6: return [3 /*break*/, 0];
                case 7: return [2 /*return*/];
            }
        });
    });
}
main();
