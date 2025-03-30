import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

router.get(
    "/github/callback",
    passport.authenticate("github", { failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
    function (req, res, next) {
        req.login(req.user, (err) => {
            if (err) {
                console.error("Error during req.login:", err);
                return next(err);
            }
            console.log("User logged in via req.login:", req.user);
            req.session.save((saveErr) => {
                if (saveErr) {
                    console.error("Error saving session:", saveErr);
                    return next(saveErr);
                }
                console.log("Session saved successfully.");
                res.redirect(process.env.CLIENT_BASE_URL); // Redirect AFTER session is saved
            });
        });
    }
);

router.get("/check", (req, res) => {
	if (req.isAuthenticated()) {
		res.send({ user: req.user });
	} else {
		res.send({ user: null });
	}
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		res.json({ message: "Logged out" });
	});
});

export default router;
