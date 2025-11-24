import express from 'express';
import { exit } from 'node:process';
import passport from 'passport';
import dotenv from 'dotenv';
import session from 'express-session';
import pool from './db/pool.js';
import connectPgSimple from 'connect-pg-simple';
import indexRouter from './routes/indexRouter.js'
import './config/passport.js'
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const PGStore = connectPgSimple(session);
dotenv.config();

const PORT = 3000;
const app = express();

// View and Asset Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const assetsPath = path.join(__dirname, "public");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(assetsPath))
app.use(express.urlencoded({ extended: true }))

// Session Setup
app.use(session({
    store: new PGStore({
        pool: pool,
        tableName: 'session'
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));


// Passport Setup

app.use(passport.initialize());
app.use(passport.session());


// Router
app.use(indexRouter)


app.listen(PORT, (error) => {
    if (error) {
        console.error(error)
        exit(1);
    }

    console.log(`Express running on port ${PORT}.`);
})