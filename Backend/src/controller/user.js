import express from "express";
import { createUser, getUserByEmail,updateUserPhoneNumber } from "../model/user.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("get req");
});

router.put('/:userId/phone', async (req, res) => {
  const { userId } = req.params;
  const { phoneNumber } = req.body;
  console.log(userId);


  if (!phoneNumber) {
    return res.status(400).send("New phone number is required.");
  }

  try {
    const updatedUser = await updateUserPhoneNumber(parseInt(userId), phoneNumber);
    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).send("Failed to update user's phone number.");
  }
});






router.post("/", async (req, res) => {
  const data = req.body;
  const { email, username } = data;

  if (!email || !username) {
    return res.status(400).send("Invalid Body");
  }

  let user = await getUserByEmail(email);

  if (user) {
    return res.status(200).send("User already in DB");
  }

  user = await createUser(data);

  res.status(200).json(user);
});

export default router;
