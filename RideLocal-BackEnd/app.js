import express from "express";
import cors from "cors";
import path from "node:path";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import ridesRouter from "#api/rides";
import zipsRouter from "#api/zips";

const app = express();
export default app;

// Only the deployed frontend (or localhost during development) may call the API
app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));
app.use(express.json());
app.use(getUserFromToken);

app.get("/api/health", (req, res) => {
  res.send({ status: "ok" });
});
app.use("/api/users", usersRouter);
app.use("/api/rides", ridesRouter);
app.use("/api/zips", zipsRouter);

// Unknown API routes get a 404 instead of the React page
app.use("/api", (req, res) => res.status(404).send("Not found."));

// Serve the built React app (run `npm run build` in RideLocal-FrontEnd first)
const dist = path.join(import.meta.dirname, "../RideLocal-FrontEnd/dist");
app.use(express.static(dist));

// Any other path is a React Router page, so send index.html and let React handle it
app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.use((err, req, res, next) => {
  if (err.code === "23505")
    return res.status(409).send("That email is already registered.");
  if (err.code === "22P02" || err.code === "22007" || err.code === "22008")
    return res.status(400).send("Invalid input.");
  if (err.code === "23514")
    return res
      .status(400)
      .send(
        "Difficulty must be easy, moderate or hard, and max riders must be at least 1.",
      );
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
