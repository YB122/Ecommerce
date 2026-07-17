/** Category business logic: CRUD with configurable image upload (Cloudinary or local server) */
import { Request, Response } from "express";
export declare const createCategory: (req: Request, res: Response) => Promise<void>;
export declare const getAllCategories: (req: Request, res: Response) => Promise<void>;
export declare const getActiveCategories: (req: Request, res: Response) => Promise<void>;
export declare const getSubcategoriesByCategory: (req: Request, res: Response) => Promise<void>;
export declare const getCategoryById: (req: Request, res: Response) => Promise<void>;
export declare const updateCategory: (req: Request, res: Response) => Promise<void>;
export declare const softDeleteCategory: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=category.service.d.ts.map