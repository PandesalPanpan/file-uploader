import passport from "passport";
import prisma from "../db/prisma.js";
import { validatePassword } from "../lib/passwordUtils.js";
import passportLocal from 'passport-local';
const LocalStrategy = passportLocal.Strategy;

// VerifyCallback
const verifyCallback = async (inputUsername, inputPassword, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: { 
                username: inputUsername
            }
        });

        if (!user) {
            done(null, false, { message: "User is not found." });
        }

        const match = validatePassword(inputPassword, user.password)
        if (!match) {
            return done(null, false, { message: "Password is incorrect." });
        }

        done(null, user);
    } catch (error) {
        return done(error);
    }
}

passport.use(new LocalStrategy(verifyCallback));

// Serialize (What to put in the session to represent user)
passport.serializeUser((user, done) => {
    done(null, user.id);
})

// Deserealize (We got the id, time to put the entire object)
passport.deserializeUser(async (userId, done) => {
    try {
        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        done(null, user);
    } catch (error) {
        return done(error);
    }
})

