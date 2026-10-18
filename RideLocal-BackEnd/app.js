import express from "express";
import getUserFromToken from "#middleware/getUserFromToken";
import usersRouter from "#api/users";

const app = express();
export default app;

app.use(express.json());
app.use(getUserFromToken);

app.get("/api/health", (req, res) => {
  res.send({ status: "ok" });
});
app.use("/api/users", usersRouter);

app.use((err, req, res, next) => {
  if (err.code === "23505")
    return res.status(409).send("That email is already registered.");
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
