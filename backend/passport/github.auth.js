import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.model.js";

// passport.serializeUser((user, done) => {
//   console.log("Serializing user:", user._id);
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
// 	console.log("Deserializing user, id:", id);
// 	try {
// 	  const user = await User.findById(id);
// 	  if (!user) {
// 		console.warn("User not found with id:", id);
// 	  } else {
// 		console.log("Deserialized user:", user);
// 	  }
// 	  done(null, user);
// 	} catch (err) {
// 	  console.error("Error in deserializeUser:", err);
// 	  done(err, null);
// 	}
//   });
passport.serializeUser(function(user, done) {
	done(null, user);
  });
  
  passport.deserializeUser(function(obj, done) {
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
