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
const clients_route_1 = __importDefault(require("./routes/clients-route"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./repositories/db");
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = require("./routes/auth-route");
const users_route_1 = require("./routes/users-route");
const error_middleware_1 = __importDefault(require("./middlewares/error-middleware"));
const auth_middleware_1 = require("./middlewares/auth-middleware");
const checkActivation_middleware_1 = require("./middlewares/checkActivation-middleware");
const briefcase_route_1 = require("./routes/briefcase-route");
const catalog_route_1 = require("./routes/catalog-route");
const address_route_1 = require("./routes/address-route");
const phone_route_1 = require("./routes/phone-route");
const invoices_route_1 = require("./routes/invoices-route");
const deliveryRoutes_route_1 = require("./routes/deliveryRoutes-route");
const privateReport_route_1 = require("./routes/privateReport-route");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const corsOptions = {
    origin: ['http://localhost:5173', 'https://market-managey.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    maxAge: 600,
};
const parserMiddleware = (0, body_parser_1.default)();
app.use(parserMiddleware);
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(corsOptions));
// @ts-ignore
app.use('/clients', auth_middleware_1.authMiddleware, checkActivation_middleware_1.isActivationMiddleware, clients_route_1.default);
app.use('/', auth_route_1.authRoute);
// @ts-ignore
app.use('/users', auth_middleware_1.authMiddleware, users_route_1.usersRoute);
// @ts-ignore
app.use('/briefcase', auth_middleware_1.authMiddleware, checkActivation_middleware_1.isActivationMiddleware, briefcase_route_1.briefcaseRoute);
// @ts-ignore
app.use('/address', auth_middleware_1.authMiddleware, address_route_1.addressRoute);
// @ts-ignore
app.use('/catalog', auth_middleware_1.authMiddleware, checkActivation_middleware_1.isActivationMiddleware, catalog_route_1.catalogRoute);
// @ts-ignore
app.use('/phone', auth_middleware_1.authMiddleware, phone_route_1.phoneRoute);
// @ts-ignore
app.use('/deliveryRoute', auth_middleware_1.authMiddleware, deliveryRoutes_route_1.deliveryRoutesRoute);
// @ts-ignore
app.use('/invoices', auth_middleware_1.authMiddleware, invoices_route_1.invoicesRoute);
// @ts-ignore
app.use('/private-report', auth_middleware_1.authMiddleware, privateReport_route_1.privateReportRoute);
app.use(error_middleware_1.default);
const startApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.runDb)();
    app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
});
startApp();
//# sourceMappingURL=index.js.map