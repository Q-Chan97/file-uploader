import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { prisma } from "./db/prisma.js";
import bcrypt from "bcryptjs";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import authRouter from "./routers/authRouter.js";
import appRouter from "./routers/appRouter.js"

import { type Request, type Response, type NextFunction } from "express";

const app = express();

const PORT = process.env.PORT;
const __dirname = import.meta.dirname;
console.log("dirname: ", __dirname)
console.log("views path: ", path.join(__dirname, "./views"))

app.set("views", "./views");
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
    throw new Error("Session secret must be set")
}

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(
            prisma,
            {
              checkPeriod: 2 * 60 * 1000,
              dbRecordIdIsSessionId: true,
              dbRecordIdFunction: undefined,
            }
        )
    })
);

app.use(express.urlencoded({ extended: false }));
app.use(passport.session());

passport.use(
    new LocalStrategy( async (username: string, password: string, done) => {
        try {
            const user = await prisma.user.findUnique({
                where: { username: username }
            })
            if (!user) {
                return done(null, false, { message: "Profile not found" })
            }

            const match = await bcrypt.compare(password, user.password)
            if (!match) {
                return done(null, false, { message: "Incorrect password" })
            }

            return done(null, user)
        } catch (err) {
            return done(err)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: id }
        })
        if (!user) {
            return done(null, false)
        }

        done(null, user)
    } catch (err) {
        done(err)
    }
});

app.use("/", authRouter);
app.use("/", appRouter);

// Unmatched routes
app.use((req, res) => {
    res.status(404).render("404page")
});

//Error handler
app.use((err: Error & {status: number, code: string}, req: Request, res: Response, next: NextFunction) => {

    if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(400).redirect(req.get("Referrer") || "/")
    }
    console.error(err);
    res.status(err.status || 500).render("404page")
});

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Express server listening on port ${PORT}`)
});