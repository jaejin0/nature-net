import express from "express";
import { exec, spawn } from "child_process";

const router = express.Router();


let cameraProcess = null;

router.post("/run-camera", async (req, res) => {
  if (!cameraProcess) {
    // Start the camera process only if there's no existing process
    cameraProcess = spawn("python", ["../detection_script/cam.py"]);

    cameraProcess.stdout.on("data", (data) => {
      console.log(`stdout: ${data}`);
    });

    cameraProcess.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`);
    });

    cameraProcess.on("close", (code) => {
      console.log(`child process exited with code ${code}`);
      cameraProcess = null; // Reset cameraProcess after termination
    });

    return res.status(200).send("Python script execution started successfully");
  } else {
    cameraProcess.kill("SIGINT"); // Send interrupt signal to gracefully terminate
    cameraProcess = null; // Reset cameraProcess after termination
    console.log("Camera stopped");
    return res.status(500).send("Camera process is already running");
  }
});

router.post("/stop-camera", async (req, res) => {
  if (cameraProcess) {
    // Attempt to kill the running Python process
    cameraProcess.kill("SIGINT"); // Send interrupt signal to gracefully terminate
    cameraProcess = null; // Reset cameraProcess after termination
    console.log("Camera stopped");
    return res.status(200).send("Camera stopped successfully");
  } else {
    console.error("No camera process running");
    return res.status(500).send("No camera process running");
  }
});

export default router;
