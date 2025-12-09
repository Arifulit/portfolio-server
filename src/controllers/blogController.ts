import { Response } from 'express';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/authMiddleware';

// Get all blogs (public)
export const getAllBlogs = async (req: AuthRequest, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
    });

    res.json(blogs);
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};

// Get single blog (public)
export const getBlogById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const blog = await prisma.blog.findUnique({
      where: { id },
    });

    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    res.json(blog);
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ message: 'Failed to fetch blog' });
  }
};

// Create blog (private)
export const createBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { title, content, description, image, published } = req.body;

    // Validation
    if (!title || !content || !description) {
      return res.status(400).json({ 
        message: 'Title, content, and description are required' 
      });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        description,
        image,
        published: published || false,
      },
    });

    res.status(201).json({ message: 'Blog created successfully', blog });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ message: 'Failed to create blog' });
  }
};

// Update blog (private)
export const updateBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, description, image, published } = req.body;

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        description,
        image,
        published,
      },
    });

    res.json({ message: 'Blog updated successfully', blog });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ message: 'Failed to update blog' });
  }
};

// Delete blog (private)
export const deleteBlog = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.blog.delete({
      where: { id },
    });

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ message: 'Failed to delete blog' });
  }
};

// Get all blogs for dashboard (private - includes unpublished)
export const getAllBlogsForDashboard = async (req: AuthRequest, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json(blogs);
  } catch (error) {
    console.error('Get dashboard blogs error:', error);
    res.status(500).json({ message: 'Failed to fetch blogs' });
  }
};