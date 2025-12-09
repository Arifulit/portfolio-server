import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all projects (public)
export const getAllProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = search
      ? {
          OR: [
            { title: { contains: search as string, mode: 'insensitive' as const } },
            { description: { contains: search as string, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.project.count({ where }),
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
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch projects' 
    });
  }
};

// Get single project by ID (public)
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
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
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch project' 
    });
  }
};

// Create project (private)
export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { 
      title, 
      description, 
      thumbnail, 
      liveUrl, 
      githubUrl, 
      features,
      technologies 
    } = req.body;

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

    const project = await prisma.project.create({
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
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create project' 
    });
  }
};

// Update project (private)
export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { 
      title, 
      description, 
      thumbnail, 
      liveUrl, 
      githubUrl, 
      features,
      technologies 
    } = req.body;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
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

    const project = await prisma.project.update({
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
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update project' 
    });
  }
};

// Delete project (private)
export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      res.status(404).json({ 
        success: false,
        message: 'Project not found' 
      });
      return;
    }

    await prisma.project.delete({
      where: { id },
    });

    res.json({ 
      success: true,
      message: 'Project deleted successfully' 
    });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete project' 
    });
  }
};

// Get project statistics (private)
export const getProjectStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalProjects = await prisma.project.count();

    const projectsWithLiveUrl = await prisma.project.count({
      where: {
        liveUrl: {
          not: null,
        },
      },
    });

    const projectsWithGithubUrl = await prisma.project.count({
      where: {
        githubUrl: {
          not: null,
        },
      },
    });

    const recentProjects = await prisma.project.findMany({
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
  } catch (error) {
    console.error('Get project stats error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch project statistics' 
    });
  }
};