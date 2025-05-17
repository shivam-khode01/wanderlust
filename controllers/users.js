const User= require("../models/user");
const user = require("../models/user");
module.exports.renderSignupForm =(req, res) => {
    res.render("users/signup");
}
module.exports.signup=( async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new user({ username, email });
        const registeredUser = await user.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                console.log(err);
                return next(err);
            }
                    req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listing");
        });

    } catch (e) {
        console.log(e);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
})

module.exports.renderLoginForm =  (req, res) => {
    res.render("users/login");

}

module.exports.login =async(req, res) => {
    const { username } = req.body;
    req.flash("success", `Welcome back, ${username}!`);
    res.redirect(res.locals.redirectUrl || "/listing");
}

module.exports.logout = (req, res,next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
            console.log(err);
        }
        req.flash("success", "Goodbye!");
        res.redirect("/listing");
    });
}