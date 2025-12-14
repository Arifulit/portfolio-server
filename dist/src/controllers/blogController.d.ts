import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
export declare const getAllBlogs: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getBlogById: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getAllBlogsForDashboard: (req: AuthRequest, res: Response) => Promise<void>;
export declare const createBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const updateBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const deleteBlog: (req: AuthRequest, res: Response) => Promise<void>;
export declare const togglePublishStatus: (req: AuthRequest, res: Response) => Promise<void>;
//# sourceMappingURL=blogController.d.ts.map