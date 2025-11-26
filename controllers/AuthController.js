import passport from "passport";
import prisma from "../db/prisma.js";
import { hashPassword } from "../lib/passwordUtils.js";
import { isAuth } from "../middlewares/auth.js";
import { body, validationResult } from "express-validator";

const validateUser = [
    body("username").trim()
        .isLength({ min: 6 }).withMessage("Username has to be atleast 6 characters.")
        .isAlphanumeric().withMessage("Username must be alphanumeric characters only."),
    body("password")
        .isLength({ min: 8 }).withMessage("Password must be atleast 8 characters."),
    body("confirm_password").custom((value, { req }) => {
        return value === req.body.password
    }).withMessage("Passwords does not match.")
]


export const signUpGet = (req, res) => {
    res.render("sign-up");
}

export const signUpPost = [
    validateUser,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render("sign-up", {
                errors: errors.array()
            });
        }

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

        res.redirect("/login");
    }
]

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