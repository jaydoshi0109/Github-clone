import express from "express";
import passport from "passport";

const router = express.Router();

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));

// Add this logout endpoint (POST method)
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

// Enhanced check endpoint
router.get("/check", async (req, res) => {
  try {
    // Force reload session from store
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

// GitHub callback with explicit session handling
router.get("/github/callback", 
  passport.authenticate("github", {
    failureRedirect: process.env.CLIENT_BASE_URL + "/login?error=auth_failed"
  }),
  async (req, res) => {
    try {
      // Explicitly save session
      await new Promise((resolve, reject) => {
        req.session.save(err => {
          if (err) return reject(err);
          console.log('Session saved:', req.sessionID);
          resolve();
        });
      });
      
      res.redirect(process.env.CLIENT_BASE_URL);
    } catch (err) {
      console.error('Callback error:', err);
      res.redirect(process.env.CLIENT_BASE_URL + '/login?error=session_error');
    }
  }
);

export default router;
