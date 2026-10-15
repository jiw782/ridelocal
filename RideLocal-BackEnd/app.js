import express from "express";

const app = express();
export default app;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.send({ status: "ok" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
