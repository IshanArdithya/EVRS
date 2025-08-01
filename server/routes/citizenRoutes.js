import express from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  getCitizenVaccinations,
  updateCitizenProfile,
  requestEmailChange,
  verifyEmailChange,
  requestPhoneChange,
  verifyPhoneChange,
  updateMedicalInfo,
  changePassword,
} from "../controllers/citizenController.js";

const router = express.Router();

router.get("/vaccinations/:citizenId", getCitizenVaccinations);
router.put("/profile", authenticateToken, updateCitizenProfile);

// email otp req and verify
router.post("/profile/email/request", authenticateToken, requestEmailChange);
router.post("/profile/email/verify", authenticateToken, verifyEmailChange);

// phone otp req and verify
router.post("/profile/phone/request", authenticateToken, requestPhoneChange);
router.post("/profile/phone/verify", authenticateToken, verifyPhoneChange);

router.put("/profile/medical", authenticateToken, updateMedicalInfo);

router.put("/profile/password", authenticateToken, changePassword);

export default router;
