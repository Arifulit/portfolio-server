import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
    userId: string;
    email: string;
}
export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export declare const authMiddleware: (req: AuthRequest, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=authMiddleware.d.ts.map