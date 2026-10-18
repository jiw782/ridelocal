/** Sends 401 unless getUserFromToken found a logged-in user */
export default function requireUser(req, res, next) {
  if (!req.user) return res.status(401).send("You must be logged in.");
  next();
}
