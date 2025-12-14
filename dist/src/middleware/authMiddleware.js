"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        // Support multiple token sources: Authorization header (Bearer), cookie token, body.token, query.token
        let token = undefined;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        else if (req.cookies && typeof req.cookies.token === 'string') {
            token = req.cookies.token;
        }
        else if (typeof req.body?.token === 'string') {
            token = req.body.token;
        }
        else if (typeof req.query?.token === 'string') {
            token = req.query.token;
        }
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'No token provided. Include Bearer token or provide token in body/query'
            });
            return;
        }
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined in environment variables');
            res.status(500).json({
                success: false,
                message: 'Server configuration error'
            });
            return;
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token has expired. Please login again'
            });
            return;
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token. Please login again'
            });
            return;
        }
        res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map