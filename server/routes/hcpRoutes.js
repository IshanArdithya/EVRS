import express from "express";
import {
  requestEmailChange,
  verifyEmailChange,
  requestPhoneChange,
  verifyPhoneChange,
  changePassword,
} from "../controllers/hcpController.js";
import { authenticateHCP } from "../middleware/authenticateHCP.js";

const router = express.Router();

router.post("/profile/email/request", authenticateHCP, requestEmailChange);
router.post("/profile/email/verify", authenticateHCP, verifyEmailChange);

router.post("/profile/phone/request", authenticateHCP, requestPhoneChange);
router.post("/profile/phone/verify", authenticateHCP, verifyPhoneChange);

router.put("/profile/password", authenticateHCP, changePassword);

export default router;
