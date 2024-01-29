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
exports.mailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const xxx = {
    port: 465,
    secure: true,
    host: "smtp.gmail.com",
    auth: {
        user: "meatemarketsup@gmail.com",
        password: "tdts ymbe zadj uggg"
    }
};
exports.mailService = {
    transporter() {
        return nodemailer_1.default.createTransport(xxx);
    },
    sendActivationMail(to, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = this.transporter();
            yield res.sendMail({
                from: 'Fred Foo 👻', // sender address
                to, // list of receivers
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: "<b>Hello world?</b>", // html body
            });
        });
    }
};
