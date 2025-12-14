"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Private routes (requires authentication) - place before dynamic :id to avoid conflicts
router.get('/dashboard/all', authMiddleware_1.authMiddleware, blogController_1.getAllBlogsForDashboard);
router.get('/dashboard/stats', authMiddleware_1.authMiddleware, blogController_1.getBlogStats);
router.post('/', authMiddleware_1.authMiddleware, blogController_1.createBlog);
router.put('/:id', authMiddleware_1.authMiddleware, blogController_1.updateBlog);
router.patch('/:id/publish', authMiddleware_1.authMiddleware, blogController_1.togglePublishStatus);
router.delete('/:id', authMiddleware_1.authMiddleware, blogController_1.deleteBlog);
// Public routes
router.get('/', blogController_1.getAllBlogs);
router.get('/:id', blogController_1.getBlogById);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map