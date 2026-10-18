import express from "express";
import { createRide, getRideById, getRidesByZip } from "#db/queries/rides";
import { getRidersByRideId, joinRide } from "#db/queries/rideMembers";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

// GET /api/rides?zip=77001
router.get("/", async (req, res) => {
  const { zip } = req.query;
  if (!zip) return res.status(400).send("A zip code is required.");

  const rides = await getRidesByZip(zip);
  res.send(rides);
});

router.post("/", requireUser, async (req, res) => {
  const { title, zip_code, meeting_spot, ride_date } = req.body ?? {};
  if (!title || !zip_code || !meeting_spot || !ride_date) {
    return res
      .status(400)
      .send("Title, zip code, meeting spot and ride date are required.");
  }

  const ride = await createRide({ ...req.body, creator_id: req.user.id });
  await joinRide(ride.id, req.user.id);
  res.status(201).send(ride);
});

router.get("/:id", async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");
  res.send(ride);
});

router.get("/:id/riders", async (req, res) => {
  const riders = await getRidersByRideId(req.params.id);
  res.send(riders);
});

router.post("/:id/join", requireUser, async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");

  const member = await joinRide(ride.id, req.user.id);
  if (!member)
    return res.status(409).send("This ride is full or you've already joined.");
  res.status(201).send(member);
});
