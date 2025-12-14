"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const projectController_1 = require("../controllers/projectController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Private routes (requires authentication) - place before dynamic :id to avoid conflicts
router.get('/dashboard/stats', authMiddleware_1.authMiddleware, projectController_1.getProjectStats);
router.post('/', authMiddleware_1.authMiddleware, projectController_1.createProject);
router.put('/:id', authMiddleware_1.authMiddleware, projectController_1.updateProject);
router.delete('/:id', authMiddleware_1.authMiddleware, projectController_1.deleteProject);
// Public routes
router.get('/', projectController_1.getAllProjects);
router.get('/:id', projectController_1.getProjectById);
exports.default = router;
//# sourceMappingURL=projectRoutes.js.map