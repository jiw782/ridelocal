import express from "express";
import {
  createRide,
  deleteRide,
  getRideById,
  getRidesByZip,
  getUpcomingRides,
  updateRide,
} from "#db/queries/rides";
import {
  getRidersByRideId,
  joinRide,
  leaveRide,
} from "#db/queries/rideMembers";
import requireUser from "#middleware/requireUser";
import { lookupZip } from "#utils/zippopotam";

const router = express.Router();
export default router;

/** Checks the fields a ride needs. Returns an error message, or null if the ride is valid. */
async function validateRide({ title, zip_code, meeting_spot, ride_date } = {}) {
  if (!title || !zip_code || !meeting_spot || !ride_date)
    return "Title, zip code, meeting spot and ride date are required.";
  if (!(await lookupZip(zip_code))) return "That zip code doesn't exist.";
  return null;
}

// GET /api/rides?zip=77001, or without a zip for the next rides anywhere
router.get("/", async (req, res) => {
  const { zip } = req.query;
  const rides = zip ? await getRidesByZip(zip) : await getUpcomingRides();
  res.send(rides);
});

router.post("/", requireUser, async (req, res) => {
  const invalidReason = await validateRide(req.body);
  if (invalidReason) return res.status(400).send(invalidReason);

  const ride = await createRide({ ...req.body, creator_id: req.user.id });
  await joinRide(ride.id, req.user.id);
  res.status(201).send(ride);
});

// Ride details and riders are for logged-in users only
router.get("/:id", requireUser, async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");
  res.send(ride);
});

router.get("/:id/riders", requireUser, async (req, res) => {
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

router.delete("/:id/join", requireUser, async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");
  if (ride.creator_id === req.user.id)
    return res.status(400).send("You can't leave a ride you're hosting.");

  const member = await leaveRide(ride.id, req.user.id);
  if (!member) return res.status(404).send("You haven't joined this ride.");
  res.send(member);
});

router.put("/:id", requireUser, async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");
  if (ride.creator_id !== req.user.id)
    return res.status(403).send("Only the host can edit this ride.");

  const invalidReason = await validateRide(req.body);
  if (invalidReason) return res.status(400).send(invalidReason);

  const { max_riders } = req.body;
  if (max_riders && max_riders < ride.rider_count) {
    return res
      .status(400)
      .send(`${ride.rider_count} riders have already joined this ride.`);
  }

  const updated = await updateRide(ride.id, req.body);
  res.send(updated);
});

router.delete("/:id", requireUser, async (req, res) => {
  const ride = await getRideById(req.params.id);
  if (!ride) return res.status(404).send("Ride not found.");
  if (ride.creator_id !== req.user.id)
    return res.status(403).send("Only the host can delete this ride.");

  const deleted = await deleteRide(ride.id);
  res.send(deleted);
});
