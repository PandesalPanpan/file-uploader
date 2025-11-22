import express from 'express';
import { exit } from 'node:process';
import passport from 'passport';
import dotenv from 'dotenv';
import session from 'express-session';
import pool from './db/pool.js';
import connectPgSimple from 'connect-pg-simple';
const PGStore = connectPgSimple(session);
dotenv.config();

const PORT = 3000;
const app = express();

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
import './config/passport.js'
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
    res.send("Check your cookies");
})


app.listen(PORT, (error) => {
    if (error) {
        console.error(error)
        exit(1);
    }

    console.log(`Express running on port ${PORT}.`);
})