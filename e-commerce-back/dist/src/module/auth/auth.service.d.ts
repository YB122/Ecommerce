/** Auth business logic: user creation, token generation, email verification, password reset */
import { Request, Response } from "express";
export declare const googleSignupHandler: (req: Request, res: Response) => void;
export declare const googleLoginHandler: (req: Request, res: Response) => void;
export declare const signupHandler: (req: Request, res: Response) => Promise<void>;
export declare const loginHandler: (req: Request, res: Response) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const resendVerifyEmail: (req: Request, res: Response) => Promise<void>;
export declare const forgotPasswordHandler: (req: Request, res: Response) => Promise<void>;
export declare const resetPasswordHandler: (req: Request, res: Response) => Promise<void>;
export declare const refreshAccessToken: (req: Request, res: Response) => Promise<void>;
//# sourceMappingURL=auth.service.d.ts.map