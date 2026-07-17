/** Order business logic: creation with stock deduction, shipping cost, status management */
import { Request, Response } from "express";
export declare const createOrder: (req: Request, res: Response) => Promise<void>;
export declare const getMyOrders: (req: Request, res: Response) => Promise<void>;
export declare const getOrderById: (req: Request, res: Response) => Promise<void>;
export declare const getAllOrders: (req: Request, res: Response) => Promise<void>;
export declare const updateOrderStatus: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=order.service.d.ts.map