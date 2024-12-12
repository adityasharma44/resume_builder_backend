import express from "express";
import { authController } from "../controllers/authController.js";
import uploadFile from "../middlewares/fileUploader.js";

const router = express.Router();

router.post("/signup", authController.register);
router.post("/signin", authController.login);

export default router;
