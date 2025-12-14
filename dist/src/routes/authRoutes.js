"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// Authentication routes
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authMiddleware_1.authMiddleware, authController_1.logout);
router.get('/me', authMiddleware_1.authMiddleware, authController_1.getCurrentUser);
router.get('/profile', authMiddleware_1.authMiddleware, authController_1.getProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map