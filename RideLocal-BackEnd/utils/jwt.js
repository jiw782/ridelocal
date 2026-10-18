import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET;

/** Creates a token that holds the given data, e.g. { id: 1 } */
export function createToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Returns the data stored in the token. Throws if the token is invalid or expired. */
export function verifyToken(token) {
  return jwt.verify(token, SECRET);
}
