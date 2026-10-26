import express from "express";
import {
  createUser,
  getUserByEmailAndPassword,
  updateUser,
} from "#db/queries/users";
import { createToken } from "#utils/jwt";
import requireUser from "#middleware/requireUser";
import { getRidesByUserId } from "#db/queries/rides";

const router = express.Router();
export default router;

router.post("/register", async (req, res) => {
  const { name, email, password, zip_code } = req.body ?? {};
  if (!name || !email || !password || !zip_code) {
    return res
      .status(400)
      .send("Name, email, password and zip code are required.");
  }

  const user = await createUser(req.body);
  const token = createToken({ id: user.id });
  res.status(201).send({ token, user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    return res.status(400).send("Email and password are required.");
  }

  const user = await getUserByEmailAndPassword(email, password);
  if (!user) return res.status(401).send("Invalid email or password.");

  const token = createToken({ id: user.id });
  res.send({ token, user });
});

router.get("/me", requireUser, (req, res) => {
  res.send(req.user);
});

router.get("/me/rides", requireUser, async (req, res) => {
  const rides = await getRidesByUserId(req.user.id);
  res.send(rides);
});

router.put("/me", requireUser, async (req, res) => {
  const { name, zip_code, bio, profile_pic } = req.body ?? {};
  if (!name || !zip_code) {
    return res.status(400).send("Name and zip code are required.");
  }

  const user = await updateUser(req.user.id, {
    name,
    zip_code,
    // an empty box clears the field
    bio: bio || null,
    profile_pic: profile_pic || null,
  });
  res.send(user);
});
