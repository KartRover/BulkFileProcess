"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET;
const verifyJwt = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, supabaseJwtSecret);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};
exports.verifyJwt = verifyJwt;
