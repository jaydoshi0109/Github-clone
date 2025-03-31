import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Add this logout endpoint (POST method)


// Enhanced check endpoint
router.get("/check", (req, res) => {
	if (req.isAuthenticated()) {
		res.send({ user: req.user });
	} else {
		res.send({ user: null });
	}
});

// GitHub callback with explicit session handling
router.get(
	"/github/callback",
	passport.authenticate("github", { failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
	function (req, res) {
		res.redirect(process.env.CLIENT_BASE_URL);
	}
);

router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) return next(err);
      res.clearCookie('gh_clone.sid');
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
