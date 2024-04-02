import express from "express";
import { getAnimalId, updateAnimalThreatLevel } from "../model/animal.js";

const router = express.Router();

router.put('/:animalId/threatLevel', async (req, res) => {
  const { animalId } = req.params;
  const { threatLevel } = req.body;

  if (!threatLevel) {
    return res.status(400).send("New threat level is required.");
  }

  try {
    const updatedAnimal = await updateAnimalThreatLevel(parseInt(animalId), threatLevel);
    res.json(updatedAnimal);
  } catch (error) {
    res.status(500).send("Failed to update animal's threat level.");
  }
});


router.post('/animalId', async(req,res) =>{
  const {animalName,userId} = req.body;

  if(!animalName || !userId){
    return res.status(400).send("User ID or animal name does not exist ");
  }

  const animalId= await getAnimalId(userId,animalName);
  
  res.status(200).send("animal Id: " + animalId);

})

export default router;
