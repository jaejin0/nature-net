import express from "express";
import { getAnimalId, getThreatLevel, updateAnimalThreatLevel, getAnimalName } from "../model/animal.js";

const router = express.Router();

router.put("/:animalId/threatLevel", async (req, res) => {
  const { animalId } = req.params;
  const { threatLevel } = req.body;

  if (!threatLevel) {
    return res.status(400).send("New threat level is required.");
  }

  try {
    const updatedAnimal = await updateAnimalThreatLevel(
      parseInt(animalId),
      threatLevel
    );
    res.json(updatedAnimal);
  } catch (error) {
    res.status(500).send("Failed to update animal's threat level.");
  }
});


router.post("/animalId", async (req, res) => {
  const { animalName, userId } = req.body;

  if (!animalName || !userId) {
    return res.status(400).send("User ID or animal name does not exist ");
  }

  const animalId = await getAnimalId(userId, animalName);

  res.status(200).send("animal Id: " + animalId);
});

export default router;

router.get("/animalId", async (req, res) => {
  const animalId = parseInt(req.query.animalId, 10);

  // Check if animalId is a valid number after parsing
  if (isNaN(animalId)) {
    return res.status(400).send("Invalid animal ID provided");
  }

  try {
    const threatLevel = await getThreatLevel(animalId);
    res.status(200).send(threatLevel);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
})

router.get("/:animalId/name", async (req, res) => {
  const { animalId } = req.params;
  const id = parseInt(animalId, 10);

  // Check if animalId is a valid number after parsing
  if (isNaN(id)) {
    return res.status(400).send("Invalid animal ID provided");
  }

  try {
    const animalName = await getAnimalName(id);
    if (animalName) {
      res.status(200).send({ animalName });
    } else {
      res.status(404).send("Animal not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
