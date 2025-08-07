import express from "express";
import { authenticateRole, authorize } from "../middleware/auth.js";
import {
  getCitizenVaccinations,
  updateCitizenProfile,
  requestEmailChange,
  verifyEmailChange,
  requestPhoneChange,
  verifyPhoneChange,
  updateMedicalInfo,
  changePassword,
  getCitizenProfile,
} from "../controllers/citizenController.js";

const router = express.Router();

router.use(authenticateRole("citizen"), authorize("citizen"));

router.get("/vaccinations/citizenId", getCitizenVaccinations);
router.get("/get/profile", getCitizenProfile);
router.put("/profile", updateCitizenProfile);

// email otp req and verify
router.post("/profile/email/request", requestEmailChange);
router.post("/profile/email/verify", verifyEmailChange);

// phone otp req and verify
router.post("/profile/phone/request", requestPhoneChange);
router.post("/profile/phone/verify", verifyPhoneChange);

router.put("/profile/medical", updateMedicalInfo);

router.put("/profile/password", changePassword);

export default router;
