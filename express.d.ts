import "express-session";

declare global {
    namespace Express {
        interface User {
            id: number;
            username: string;
            email: string;
            password: string;
            createdAt: Date;
        }
    }
}

declare module "express-session" {
    interface SessionData {
        messages?: string[];
    }
}

export {}