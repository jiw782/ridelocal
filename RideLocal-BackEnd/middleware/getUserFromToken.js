import { getUserById } from "#db/queries/users";
import { verifyToken } from "#utils/jwt";

/** Sets req.user if the request has a valid "Authorization: Bearer <token>" header */
export default async function getUserFromToken(req, res, next) {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.startsWith("Bearer ")) return next();

  const token = authorization.split(" ")[1];
  try {
    const { id } = verifyToken(token);
    req.user = await getUserById(id);
    next();
  } catch {
    res.status(401).send("Invalid token.");
  }
}
