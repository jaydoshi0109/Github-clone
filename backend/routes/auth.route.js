import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// In your auth.route.js
// router.get("/github/callback",
//     passport.authenticate("github", { failureRedirect: process.env.CLIENT_BASE_URL + "/login" }),
//     function (req, res, next) {
//         console.log("GitHub callback received, user:", JSON.stringify(req.user));
//         console.log("Session ID:", req.sessionID);
//         console.log("Session data:", req.session);
        
//         req.login(req.user, (err) => {
//             if (err) {
//                 console.error("Error during req.login:", err);
//                 return next(err);
//             }
//             console.log("User logged in via req.login:", JSON.stringify(req.user));
            
//             req.session.save((saveErr) => {
//                 if (saveErr) {
//                     console.error("Error saving session:", saveErr);
//                     return next(saveErr);
//                 }
//                 console.log("Session saved successfully:", req.sessionID);
//                 console.log("Redirecting to:", process.env.CLIENT_BASE_URL);
//                 res.redirect(process.env.CLIENT_BASE_URL);
//             });
//         });
//     }
// );

router.get("/github/callback",
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login?error=github_failed",
    session: true
  }),
  async (req, res) => {
    try {
      // Force session save
      await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) return reject(err);
          console.log('Session saved after auth:', req.sessionID);
          resolve();
        });
      });
      
      // Set user in session explicitly
      req.session.user = req.user;
      
      res.redirect(process.env.CLIENT_BASE_URL);
    } catch (err) {
      console.error('GitHub callback error:', err);
      res.redirect(process.env.CLIENT_BASE_URL + '/login?error=session_error');
    }
  }
);

// Enhanced check endpoint
router.get("/check", async (req, res) => {
  try {
    // Reload session from store
    await new Promise(resolve => req.session.reload(resolve));
    
    if (req.isAuthenticated()) {
      return res.json({
        authenticated: true,
        user: {
          username: req.user.username,
          avatarUrl: req.user.avatarUrl
        }
      });
    }
    
    res.status(401).json({
      authenticated: false,
      sessionExists: !!req.sessionID
    });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		res.json({ message: "Logged out" });
	});
});

export default router;
