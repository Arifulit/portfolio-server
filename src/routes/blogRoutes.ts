import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsForDashboard,
  togglePublishStatus,
  getBlogStats,
} from '../controllers/blogController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Private routes (requires authentication) - place before dynamic :id to avoid conflicts
router.get('/dashboard/all', authMiddleware, getAllBlogsForDashboard);
router.get('/dashboard/stats', authMiddleware, getBlogStats);
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.patch('/:id/publish', authMiddleware, togglePublishStatus);
router.delete('/:id', authMiddleware, deleteBlog);

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

export default router;