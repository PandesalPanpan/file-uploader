import prisma from "../db/prisma.js";
import { hashPassword } from "../lib/passwordUtils.js";

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