import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getAllProjects: (req: Request, res: Response) => Promise<void>;
export declare const getProjectById: (req: Request, res: Response) => Promise<void>;
export declare const createProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteProject: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getProjectStats: (_req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=projectController.d.ts.map