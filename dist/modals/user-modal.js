"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, require: true },
    password: { type: String, require: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user-modal.js.map