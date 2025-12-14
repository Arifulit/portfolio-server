"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const projectRoutes_1 = __importDefault(require("./routes/projectRoutes"));
const prisma_1 = __importDefault(require("./utils/prisma"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
}));
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
app.use((0, cookie_parser_1.default)());
// Request logging middleware
app.use((req, _res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});
// Health check route
app.get('/', (_req, res) => {
    res.json({
        success: true,
        message: 'Portfolio API is running',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            blogs: '/api/blogs',
            projects: '/api/projects',
        }
    });
});
// API Routes
app.use('/api/auth', authRoutes_1.default);
app.use('/api/blogs', blogRoutes_1.default);
app.use('/api/projects', projectRoutes_1.default);
// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Global error handler
app.use((err, _req, res, _next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});
// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
process.on('SIGTERM', async () => {
    console.log('\n🛑 Shutting down gracefully...');
    await prisma_1.default.$disconnect();
    process.exit(0);
});
// Start server
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log('=================================');
    console.log('Available routes:');
    console.log(`  - GET    http://localhost:${PORT}/`);
    console.log(`  - POST   http://localhost:${PORT}/api/auth/register`);
    console.log(`  - POST   http://localhost:${PORT}/api/auth/login`);
    console.log(`  - GET    http://localhost:${PORT}/api/blogs`);
    console.log(`  - GET    http://localhost:${PORT}/api/projects`);
    console.log('=================================');
});
//# sourceMappingURL=index.js.map