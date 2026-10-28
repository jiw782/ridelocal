import express from "express";
import { lookupZip } from "#utils/zippopotam";

const router = express.Router();
export default router;

// GET /api/zips/77001 → { zip, city, state, lat, lng }
router.get("/:zip", async (req, res) => {
  const location = await lookupZip(req.params.zip);
  if (!location) return res.status(404).send("Zip code not found.");
  res.send(location);
});
