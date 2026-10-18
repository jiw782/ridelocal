import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";
import ridesRouter from "#api/rides";

const app = express();
export default app;

app.use(express.json());
app.use(getUserFromToken);

app.get("/api/health", (req, res) => {
  res.send({ status: "ok" });
});
app.use("/api/users", usersRouter);
app.use("/api/rides", ridesRouter);

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
