import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  process.nextTick(() => {
    console.log('Serializing user:', user._id);
    done(null, { 
      id: user._id,
      username: user.username 
    });
  });
});

passport.deserializeUser(async (obj, done) => {
  try {
    console.log('Deserializing user ID:', obj.id);
    const user = await User.findById(obj.id);
    if (!user) {
      console.warn('User not found during deserialization');
      return done(null, false);
    }
    console.log('Successfully deserialized user:', user.username);
    done(null, user);
  } catch (err) {
    console.error('Deserialization error:', err);
    done(err);
  }
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
        let user = await User.findOne({ username: profile.username });
        if (!user) {
          user = new User({
            name: profile.displayName,
            username: profile.username,
            profileUrl: profile.profileUrl,
            avatarUrl: profile.photos[0].value,
            likedProfiles: [],
            likedBy: [],
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
