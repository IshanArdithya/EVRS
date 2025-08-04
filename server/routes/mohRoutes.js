import express from "express";
import {
  requestPhoneChange,
  verifyPhoneChange,
  changePassword,
} from "../controllers/mohController.js";
import { authenticateMOH } from "../middleware/authenticateMOH.js";

const router = express.Router();

router.post("/profile/phone/request", authenticateMOH, requestPhoneChange);
router.post("/profile/phone/verify", authenticateMOH, verifyPhoneChange);

router.put("/profile/password", authenticateMOH, changePassword);

export default router;
