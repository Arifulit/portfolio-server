import express from 'express';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectStats,
} from '../controllers/projectController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

// Private routes (requires authentication) - place before dynamic :id to avoid conflicts
router.get('/dashboard/stats', authMiddleware, getProjectStats);
router.post('/', authMiddleware, createProject);
router.put('/:id', authMiddleware, updateProject);
router.delete('/:id', authMiddleware, deleteProject);

// Public routes
router.get('/', getAllProjects);
router.get('/:id', getProjectById);

export default router;