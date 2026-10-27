import db from "#db/client";
import bcrypt from "bcrypt";

export async function createUser({
  name,
  email,
  password,
  zip_code,
  bio,
  profile_pic,
}) {
  const sql = `
  INSERT INTO users (name, email, password_hash, zip_code, bio, profile_pic)
  VALUES ($1, $2, $3, $4, $5, $6)
  RETURNING id, name, email, zip_code, bio, profile_pic
  `;
  const passwordHash = await bcrypt.hash(password, 10);
  const {
    rows: [user],
  } = await db.query(sql, [
    name,
    email,
    passwordHash,
    zip_code,
    bio,
    profile_pic,
  ]);
  return user;
}

export async function getUserByEmailAndPassword(email, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE email = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [email]);
  if (!user) return null;

  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) return null;

  delete user.password_hash;
  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT id, name, email, zip_code, bio, profile_pic
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

/** Updates the profile fields a user can change themselves */
export async function updateUser(id, { name, zip_code, bio, profile_pic }) {
  const sql = `
  UPDATE users
  SET name = $2, zip_code = $3, bio = $4, profile_pic = $5
  WHERE id = $1
  RETURNING id, name, email, zip_code, bio, profile_pic
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id, name, zip_code, bio, profile_pic]);
  return user;
}

/** What anyone can see about a user, so no email */
export async function getPublicUserById(id) {
  const sql = `
  SELECT id, name, zip_code, bio, profile_pic
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}
