import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import MongoStore from "connect-mongo";


import "./passport/github.auth.js";
import userRoutes from "./routes/user.route.js";
import exploreRoutes from "./routes/explore.route.js";
import authRoutes from "./routes/auth.route.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());  

app.use(
	cors({
	  origin: process.env.CLIENT_BASE_URL, // e.g., "https://github-clone-silk-six.vercel.app"
	  credentials: true,
	  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	  allowedHeaders: ["Content-Type", "Authorization"],
	})
  );
  
 
  // Set up a persistent session store using connect-mongo
const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGO_URI,
  collectionName: "sessions",
});

// Configure session middleware with conditional cookie options
app.use(
  session({
    secret: process.env.SESSION_SECRET || "keyboardcat",
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: true,// Use secure cookies in production (requires HTTPS)
      sameSite: "none",
	  domain: process.env.BACKEND_URL,
    },
  })
);

// Initialize Passport and its session middleware
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration – ensure this matches your frontend URL exactly


// Optional: Debug middleware to log session and user info for each request
app.use((req, res, next) => {
  console.log(`Session ID: ${req.sessionID} | User: ${JSON.stringify(req.user)}`);
  next();
});


app.get("/api/test-session", (req, res) => {
	req.session.test = req.session.test || "cookie-set";
	res.send({ session: req.session, sessionID: req.sessionID });
  });
  

// Set up routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/explore", exploreRoutes);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  connectMongoDB();
});
