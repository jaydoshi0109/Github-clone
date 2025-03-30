export async function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
	  return next();
	}
	console.warn("User is not authenticated. Redirecting to login.");
	res.redirect(process.env.CLIENT_BASE_URL + "/login");
  }
  