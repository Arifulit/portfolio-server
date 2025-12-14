"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProjectStats = exports.deleteProject = exports.updateProject = exports.createProject = exports.getProjectById = exports.getAllProjects = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
// Get all projects (public)
const getAllProjects = async (req, res) => {
    try {
        const { page = '1', limit = '10', search = '' } = req.query;
        const pageNum = parseInt(page);
        const limitNum = parseInt(limit);
        const skip = (pageNum - 1) * limitNum;
        const where = search
            ? {
                OR: [
                    { title: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};
        const [projects, total] = await Promise.all([
            prisma_1.default.project.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                skip,
                take: limitNum,
            }),
            prisma_1.default.project.count({ where }),
        ]);
        res.json({
            success: true,
            data: projects,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(total / limitNum),
            },
        });
    }
    catch (error) {
        console.error('Get projects error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch projects'
        });
    }
};
exports.getAllProjects = getAllProjects;
// Get single project by ID (public)
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await prisma_1.default.project.findUnique({
            where: { id },
        });
        if (!project) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        res.json({
            success: true,
            data: project,
        });
    }
    catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project'
        });
    }
};
exports.getProjectById = getProjectById;
// Create project (private)
const createProject = async (req, res) => {
    try {
        const { title, description, thumbnail, liveUrl, githubUrl, features, technologies } = req.body;
        // Validation
        if (!title || !description) {
            res.status(400).json({
                success: false,
                message: 'Title and description are required'
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
        // Validate features array
        if (features && !Array.isArray(features)) {
            res.status(400).json({
                success: false,
                message: 'Features must be an array'
            });
            return;
        }
        // Validate technologies array
        if (technologies && !Array.isArray(technologies)) {
            res.status(400).json({
                success: false,
                message: 'Technologies must be an array'
            });
            return;
        }
        const project = await prisma_1.default.project.create({
            data: {
                title: title.trim(),
                description: description.trim(),
                thumbnail: thumbnail || null,
                liveUrl: liveUrl || null,
                githubUrl: githubUrl || null,
                features: features || [],
                technologies: technologies || [],
            },
        });
        res.status(201).json({
            success: true,
            message: 'Project created successfully',
            data: project
        });
    }
    catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create project'
        });
    }
};
exports.createProject = createProject;
// Update project (private)
const updateProject = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, thumbnail, liveUrl, githubUrl, features, technologies } = req.body;
        // Check if project exists
        const existingProject = await prisma_1.default.project.findUnique({
            where: { id },
        });
        if (!existingProject) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
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
        if (features && !Array.isArray(features)) {
            res.status(400).json({
                success: false,
                message: 'Features must be an array'
            });
            return;
        }
        if (technologies && !Array.isArray(technologies)) {
            res.status(400).json({
                success: false,
                message: 'Technologies must be an array'
            });
            return;
        }
        const project = await prisma_1.default.project.update({
            where: { id },
            data: {
                ...(title && { title: title.trim() }),
                ...(description && { description: description.trim() }),
                ...(thumbnail !== undefined && { thumbnail: thumbnail || null }),
                ...(liveUrl !== undefined && { liveUrl: liveUrl || null }),
                ...(githubUrl !== undefined && { githubUrl: githubUrl || null }),
                ...(features && { features }),
                ...(technologies && { technologies }),
            },
        });
        res.json({
            success: true,
            message: 'Project updated successfully',
            data: project
        });
    }
    catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update project'
        });
    }
};
exports.updateProject = updateProject;
// Delete project (private)
const deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        // Check if project exists
        const existingProject = await prisma_1.default.project.findUnique({
            where: { id },
        });
        if (!existingProject) {
            res.status(404).json({
                success: false,
                message: 'Project not found'
            });
            return;
        }
        await prisma_1.default.project.delete({
            where: { id },
        });
        res.json({
            success: true,
            message: 'Project deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete project'
        });
    }
};
exports.deleteProject = deleteProject;
// Get project statistics (private)
const getProjectStats = async (_req, res) => {
    try {
        const totalProjects = await prisma_1.default.project.count();
        const projectsWithLiveUrl = await prisma_1.default.project.count({
            where: {
                liveUrl: {
                    not: null,
                },
            },
        });
        const projectsWithGithubUrl = await prisma_1.default.project.count({
            where: {
                githubUrl: {
                    not: null,
                },
            },
        });
        const recentProjects = await prisma_1.default.project.findMany({
            orderBy: { createdAt: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                createdAt: true,
            },
        });
        res.json({
            success: true,
            data: {
                total: totalProjects,
                withLiveUrl: projectsWithLiveUrl,
                withGithubUrl: projectsWithGithubUrl,
                recent: recentProjects,
            },
        });
    }
    catch (error) {
        console.error('Get project stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch project statistics'
        });
    }
};
exports.getProjectStats = getProjectStats;
//# sourceMappingURL=projectController.js.map