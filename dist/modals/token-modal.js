"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TokenSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    refreshToken: { type: String, require: true },
});
exports.default = (0, mongoose_1.model)('Token', TokenSchema);
//# sourceMappingURL=token-modal.js.map