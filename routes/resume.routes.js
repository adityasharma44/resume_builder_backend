import express from "express";
import { resumeController } from "../controllers/resumeController.js";
import authorization from "../middlewares/auth.js";
import uploadFile from "../middlewares/fileUploader.js";

const router = express.Router();

router.post("/addResume/:fileCategory", uploadFile, resumeController.addResume);
router.post("/getResumes", resumeController.getResumes);
router.post("/getResumeDetails", resumeController.getResumeDetails);
router.put(
  "/updateResume/:fileCategory",
  uploadFile,
  resumeController.updateResume
);

export default router;
