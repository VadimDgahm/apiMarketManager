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
exports.runDb = exports.invoicesCollection = exports.deliveryRoutesCollection = exports.catalogCollection = exports.briefcaseCollection = exports.refreshTokenCollection = exports.usersCollection = exports.clientCollection = void 0;
const mongodb_1 = require("mongodb");
const password = process.env.DB_PASSWORD;
const login = process.env.DB_LOGIN;
const mongoUri = `mongodb+srv://Pass123:Pass123@cluster0.hvknfqy.mongodb.net/meatMarket?retryWrites=true&w=majority&appName=Cluster0` || "mongodb://0.0.0.0:27037";
//const mongoUri = "mongodb://0.0.0.0:27017"
const client = new mongodb_1.MongoClient(mongoUri, {
    serverApi: {
        version: mongodb_1.ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const db = client.db('meatMarket');
exports.clientCollection = db.collection('clients');
exports.usersCollection = db.collection('users');
exports.refreshTokenCollection = db.collection('refreshToken');
exports.briefcaseCollection = db.collection('briefcase');
exports.catalogCollection = db.collection('catalog');
exports.deliveryRoutesCollection = db.collection('deliveryRoutes');
exports.invoicesCollection = db.collection('invoices');
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.connect();
            yield client.db("meatMarket").command({ ping: 1 });
            console.log("Connected successfully to mongo server");
        }
        catch (e) {
            console.log("can't to db");
            yield client.close();
        }
    });
}
exports.runDb = runDb;
//# sourceMappingURL=db.js.map