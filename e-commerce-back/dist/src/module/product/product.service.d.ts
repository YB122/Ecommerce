/** Product business logic: CRUD, configurable multi-image upload (Cloudinary or local server), stock management */
import { Request, Response } from "express";
export declare const createProduct: (req: Request, res: Response) => Promise<void>;
export declare const updateProduct: (req: Request, res: Response) => Promise<void>;
export declare const getAllProducts: (req: Request, res: Response) => Promise<void>;
export declare const getActiveProducts: (req: Request, res: Response) => Promise<void>;
export declare const getProductById: (req: Request, res: Response) => Promise<void>;
export declare const getActiveProductById: (req: Request, res: Response) => Promise<void>;
export declare const getProductsByCategory: (req: Request, res: Response) => Promise<void>;
export declare const getProductsBySubcategory: (req: Request, res: Response) => Promise<void>;
export declare const softDeleteProduct: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=product.service.d.ts.map