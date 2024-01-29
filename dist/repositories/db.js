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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.RefreshTokenCollection = exports.UsersCollection = exports.clientCollection = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.mongoURI || 'mongodb://0.0.0.0:27017';
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db('meatMarket');
exports.clientCollection = db.collection('clients');
exports.UsersCollection = db.collection('users');
exports.RefreshTokenCollection = db.collection('refreshToken');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("meatMarket").command({ ping: 1 });
            console.log("Connected successfully to mongo server");
        }
        catch (_a) {
            console.log("can`t to db");
            yield client.close();
        }
    });
}
exports.runDb = runDb;
