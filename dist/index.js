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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const clients_route_1 = require("./routes/clients-route");
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./repositories/db");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = require("./routes/auth-route");
const users_route_1 = require("./routes/users-route");
// import mongoose from 'mongoose'
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
};
const parserMiddleware = (0, body_parser_1.default)();
app.use(parserMiddleware);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
app.use('/clients', clients_route_1.clientsRoute);
app.use('/auth', auth_route_1.authRoute);
app.use('/users', users_route_1.usersRoute);
app.get('/', (req, res) => {
    res.send('<h1 style={color: "red"}>HelloWord</h1>');
});
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    // process.env.DB_URL &&  await mongoose.connect(process.env.DB_URL)
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
});
startApp();
