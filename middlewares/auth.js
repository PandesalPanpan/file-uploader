
export const isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user= req.user.username;
        next();
    } else {
        res.status(401).redirect('/login')
    }
}