import express from 'express';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsForDashboard,
  togglePublishStatus,
} from '../controllers/blogController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Public routes
router.get('/', getAllBlogs);
router.get('/:id', getBlogById);

// Private routes (requires authentication)
router.get('/dashboard/all', authMiddleware, getAllBlogsForDashboard);
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.patch('/:id/publish', authMiddleware, togglePublishStatus);
router.delete('/:id', authMiddleware, deleteBlog);

export default router;