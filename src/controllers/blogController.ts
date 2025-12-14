import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// Dashboard blog stats (private)
export const getBlogStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, published, drafts, recent] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.blog.count({ where: { published: false } }),
      prisma.blog.findMany({
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
  } catch (error) {
    console.error('Get blog stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch blog statistics',
    });
  }
};

// Get all published blogs (public)
export const getAllBlogs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where = {
      published: true,
      ...(search && {
        OR: [
          { title: { contains: search as string, mode: 'insensitive' as const } },
          { description: { contains: search as string, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.blog.count({ where }),
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
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch blogs' 
    });
  }
};

// Get single blog by ID (public)
export const getBlogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
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
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch blog' 
    });
  }
};

// Get all blogs for dashboard (private - includes unpublished)
export const getAllBlogsForDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = '1', limit = '10', search = '', status = 'all' } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {
      ...(search && {
        OR: [
          { title: { contains: search as string, mode: 'insensitive' as const } },
          { description: { contains: search as string, mode: 'insensitive' as const } },
        ],
      }),
    };

    if (status === 'published') {
      where.published = true;
    } else if (status === 'draft') {
      where.published = false;
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.blog.count({ where }),
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
  } catch (error) {
    console.error('Get dashboard blogs error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch blogs' 
    });
  }
};

// Create blog (private)
export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
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

    const blog = await prisma.blog.create({
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
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create blog' 
    });
  }
};

// Update blog (private)
export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, description, image, published } = req.body;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
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

    const blog = await prisma.blog.update({
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
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update blog' 
    });
  }
};

// Delete blog (private)
export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const existingBlog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingBlog) {
      res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
      return;
    }

    await prisma.blog.delete({
      where: { id },
    });

    res.json({ 
      success: true,
      message: 'Blog deleted successfully' 
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete blog' 
    });
  }
};

// Toggle blog publish status (private)
export const togglePublishStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      res.status(404).json({ 
        success: false,
        message: 'Blog not found' 
      });
      return;
    }

    const updatedBlog = await prisma.blog.update({
      where: { id },
      data: { published: !blog.published },
    });

    res.json({
      success: true,
      message: `Blog ${updatedBlog.published ? 'published' : 'unpublished'} successfully`,
      data: updatedBlog,
    });
  } catch (error) {
    console.error('Toggle publish status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update blog status' 
    });
  }
};