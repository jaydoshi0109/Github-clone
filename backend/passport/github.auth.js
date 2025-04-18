import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";
import dotenv from "dotenv";
dotenv.config();

// Serialize and deserialize user
passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/auth/github/callback`,
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        const user = await User.findOne({ username: profile.username });
        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            username: profile.username,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos[0].value,
            likedProfiles: [],
            likedBy: [],
          });
          await newUser.save();
          return done(null, user);
        }else {
          return done(null, user);
        }   
      } catch (error) {
        return done(error);
      }
    }
  )
);
