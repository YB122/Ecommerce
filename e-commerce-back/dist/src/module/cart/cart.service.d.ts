/** Cart business logic: CRUD with variant stock validation and subtotal calculation */
import { Request, Response } from "express";
export declare const addToCart: (req: Request, res: Response) => Promise<void>;
export declare const getCart: (req: Request, res: Response) => Promise<void>;
export declare const updateCartQuantity: (req: Request, res: Response) => Promise<void>;
export declare const removeCartItem: (req: Request, res: Response) => Promise<void>;
export declare const clearCart: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=cart.service.d.ts.map