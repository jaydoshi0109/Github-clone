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
    failureRedirect: process.env.CLIENT_BASE_URL + "/login",
    failureMessage: true // Add failure message
  }),
  (req, res) => {
    console.log('Successful authentication, user:', req.user); // Debug log
    // Set a fresh cookie after auth
    req.session.regenerate(err => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.redirect(process.env.CLIENT_BASE_URL + '/login?error=session');
      }
      req.session.save(() => {
        res.redirect(process.env.CLIENT_BASE_URL);
      });
    });
  }
);
  

// Add more logging to the /check route
router.get("/check", (req, res) => {
  console.log('Auth check - Session ID:', req.sessionID);
  console.log('Auth check - Authenticated:', req.isAuthenticated());
  console.log('Auth check - User:', req.user);
  
  if (req.isAuthenticated()) {
    return res.json({ 
      authenticated: true,
      user: req.user 
    });
  }
  
  // If not authenticated but session exists
  if (req.sessionID) {
    console.log('Session exists but not authenticated');
    return res.status(401).json({ 
      authenticated: false,
      sessionExists: true,
      sessionId: req.sessionID
    });
  }
  
  // No session at all
  res.status(401).json({ 
    authenticated: false,
    sessionExists: false
  });
});

router.get("/logout", (req, res) => {
	req.session.destroy((err) => {
		res.json({ message: "Logged out" });
	});
});

export default router;
