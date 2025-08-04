import express from "express";
import { authenticateCitizen } from "../middleware/authenticateCitizen.js";
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
router.put("/profile", authenticateCitizen, updateCitizenProfile);

// email otp req and verify
router.post("/profile/email/request", authenticateCitizen, requestEmailChange);
router.post("/profile/email/verify", authenticateCitizen, verifyEmailChange);

// phone otp req and verify
router.post("/profile/phone/request", authenticateCitizen, requestPhoneChange);
router.post("/profile/phone/verify", authenticateCitizen, verifyPhoneChange);

router.put("/profile/medical", authenticateCitizen, updateMedicalInfo);

router.put("/profile/password", authenticateCitizen, changePassword);

export default router;
