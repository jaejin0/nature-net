import express from "express";
import { supabase } from "../../supabase.config.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const image = req.files.image;
  const id = Date.now();
  console.log(image)
  const type = image.mimetype.split("/")[1];
  console.log(type)

  const { data } = await supabase.storage
    .from("images")
    .upload(`${id}.${type}`, image.data, {
      contentType: image.mimetype,
    });

  const url = supabase.storage.from("images").getPublicUrl(data.path);

  res.status(200).send({
    url: url.data.publicUrl,
  });
});

export default router;
