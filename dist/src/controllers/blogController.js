"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.togglePublishStatus = exports.deleteBlog = exports.updateBlog = exports.createBlog = exports.getAllBlogsForDashboard = exports.getBlogById = exports.getAllBlogs = exports.getBlogStats = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Dashboard blog stats (private)
const getBlogStats = async (_req, res) => {
    try {
        const [total, published, drafts, recent] = await Promise.all([
            prisma_1.default.blog.count(),
            prisma_1.default.blog.count({ where: { published: true } }),
            prisma_1.default.blog.count({ where: { published: false } }),
            prisma_1.default.blog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    title: true,
                    published: true,
                    createdAt: true,
                },
            }),
        ]);
        res.json({
            success: true,
            data: {
                total,
                published,
                drafts,
                recent,
            },
        });
    }
    catch (error) {
        console.error('Get blog stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog statistics',
        });
    }
};
exports.getBlogStats = getBlogStats;
// Get all published blogs (public)
const getAllBlogs = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            published: true,
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [blogs, total] = await Promise.all([
            prisma_1.default.blog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma_1.default.blog.count({ where }),
        ]);
        res.json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs'
        });
    }
};
exports.getAllBlogs = getAllBlogs;
// Get single blog by ID (public)
const getBlogById = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma_1.default.blog.findUnique({
            where: { id },
        });
        if (!blog) {
            res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
            return;
        }
        // Only show published blogs to public (unless authenticated)
        if (!blog.published && !req.user) {
            res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
            return;
        }
        res.json({
            success: true,
            data: blog,
        });
    }
    catch (error) {
        console.error('Get blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blog'
        });
    }
};
exports.getBlogById = getBlogById;
// Get all blogs for dashboard (private - includes unpublished)
const getAllBlogsForDashboard = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '', status = 'all' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = {
            ...(search && {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        if (status === 'published') {
            where.published = true;
        }
        else if (status === 'draft') {
            where.published = false;
        }
        const [blogs, total] = await Promise.all([
            prisma_1.default.blog.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma_1.default.blog.count({ where }),
        ]);
        res.json({
            success: true,
            data: blogs,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get dashboard blogs error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch blogs'
        });
    }
};
exports.getAllBlogsForDashboard = getAllBlogsForDashboard;
// Create blog (private)
const createBlog = async (req, res) => {
    try {
        const { title, content, description, image, published } = req.body;
        // Validation
        if (!title || !content || !description) {
            res.status(400).json({
                success: false,
                message: 'Title, content, and description are required'
            });
            return;
        }
        if (title.length < 3) {
            res.status(400).json({
                success: false,
                message: 'Title must be at least 3 characters long'
            });
            return;
        }
        if (description.length < 10) {
            res.status(400).json({
                success: false,
                message: 'Description must be at least 10 characters long'
            });
            return;
        }
        const blog = await prisma_1.default.blog.create({
            data: {
                title: title.trim(),
                content: content.trim(),
                description: description.trim(),
                image: image || null,
                published: published === true,
            },
        });
        res.status(201).json({
            success: true,
            message: 'Blog created successfully',
            data: blog
        });
    }
    catch (error) {
        console.error('Create blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create blog'
        });
    }
};
exports.createBlog = createBlog;
// Update blog (private)
const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, description, image, published } = req.body;
        // Check if blog exists
        const existingBlog = await prisma_1.default.blog.findUnique({
            where: { id },
        });
        if (!existingBlog) {
            res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
            return;
        }
        // Validation
        if (title && title.length < 3) {
            res.status(400).json({
                success: false,
                message: 'Title must be at least 3 characters long'
            });
            return;
        }
        if (description && description.length < 10) {
            res.status(400).json({
                success: false,
                message: 'Description must be at least 10 characters long'
            });
            return;
        }
        const blog = await prisma_1.default.blog.update({
            where: { id },
            data: {
                ...(title && { title: title.trim() }),
                ...(content && { content: content.trim() }),
                ...(description && { description: description.trim() }),
                ...(image !== undefined && { image: image || null }),
                ...(published !== undefined && { published }),
            },
        });
        res.json({
            success: true,
            message: 'Blog updated successfully',
            data: blog
        });
    }
    catch (error) {
        console.error('Update blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog'
        });
    }
};
exports.updateBlog = updateBlog;
// Delete blog (private)
const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if blog exists
        const existingBlog = await prisma_1.default.blog.findUnique({
            where: { id },
        });
        if (!existingBlog) {
            res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
            return;
        }
        await prisma_1.default.blog.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Blog deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete blog error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete blog'
        });
    }
};
exports.deleteBlog = deleteBlog;
// Toggle blog publish status (private)
const togglePublishStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await prisma_1.default.blog.findUnique({
            where: { id },
        });
        if (!blog) {
            res.status(404).json({
                success: false,
                message: 'Blog not found'
            });
            return;
        }
        const updatedBlog = await prisma_1.default.blog.update({
            where: { id },
            data: { published: !blog.published },
        });
        res.json({
            success: true,
            message: `Blog ${updatedBlog.published ? 'published' : 'unpublished'} successfully`,
            data: updatedBlog,
        });
    }
    catch (error) {
        console.error('Toggle publish status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update blog status'
        });
    }
};
exports.togglePublishStatus = togglePublishStatus;
//# sourceMappingURL=blogController.js.map