import express from "express";
import {
  requestPhoneChange,
  verifyPhoneChange,
  changePassword,
} from "../controllers/hospitalController.js";
import { authenticateHospital } from "../middleware/authenticateHospital.js";

const router = express.Router();

router.post("/profile/phone/request", authenticateHospital, requestPhoneChange);
router.post("/profile/phone/verify", authenticateHospital, verifyPhoneChange);

router.put("/profile/password", authenticateHospital, changePassword);

export default router;
