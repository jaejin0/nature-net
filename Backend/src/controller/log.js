import express from "express";
import { createLog, getLog, getLogs } from "../model/log.js";

const router = express.Router();

// Route /log/* here

router.get("/", async (req, res) => {
  const userId = req.body.userId;
  if (!userId) return res.status(400).send("No User id provided");

  const logs = await getLogs(parseInt(userId));

  res.status(200).json(logs);
});

router.post("/", async (req, res) => {
  // Authenticate the user
  console.log(req.body)
  const log = await createLog(req.body);

  return res.status(200).json(log);
});

router.get("/:id", async (req, res) => {
  const logId = req.params.id;

  if (isNaN(parseInt(logId))) return res.status(400).send("Invalid param");

  const log = await getLog(parseInt(logId));

  if (!log) return res.status(404).send("No log found");

  return res.status(200).json(log);
});

export default router;
