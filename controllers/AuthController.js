import passport from "passport";
import prisma from "../db/prisma.js";
import { hashPassword } from "../lib/passwordUtils.js";
import { isAuth } from "../middlewares/auth.js";

export const signUpGet = (req, res) => {
    res.render("sign-up");
}

export const signUpPost = async (req, res) => {
    const { username, password } = req.body;

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
        data: {
            username: username,
            password: hashedPassword
        }
    })

    if (!user) {
        return res.status(400).render("sign-up");
    }

    res.render("index");

}

export const loginGet = (req, res) => {
    res.render("login");
}

export const loginPost = passport.authenticate(
    "local",
    {
        failureRedirect: "/login",
        successRedirect: "/"
    }
)

export const logout = [
    isAuth,
    (req, res, next) => {
        req.logout((err) => {
            if (err) return next(err);
            res.redirect('/');
        });
    }
]