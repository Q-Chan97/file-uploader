import path from "node:path";
import express from "express";
import session from "express-session";
import passport from "passport";
import LocalStrategy from "passport-local";
import { prisma } from "./db/prisma.js";
import bcrypt from "bcryptjs";
import { PrismaSessionStore } from "@quixo3/prisma-session-store";

import authRouter from "./routers/authRouter.js";

const app = express();

const PORT = process.env.PORT;
const __dirname = import.meta.dirname;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000,
        },
        secret: process.env.SESSION_SECRET,
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
    new LocalStrategy( async (username, password, done) => {
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

passport.deserializeUser(async (id, done) => {
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


// Unmatched routes
app.use((req, res) => {
    res.status(404).render("404Page")
});

//Error handler
app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || 500).render("404Page")
});

app.listen(PORT, (error) => {
    if (error) throw error;
    console.log(`Express server listening on port ${PORT}`)
});