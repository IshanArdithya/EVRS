import express from "express";
import {
  requestEmailChange,
  verifyEmailChange,
  requestPhoneChange,
  verifyPhoneChange,
  changePassword,
  addVaccination,
  getHCPProfile,
} from "../controllers/hcpController.js";
import { authenticateRole, authorize } from "../middleware/auth.js";
import {
  getAllVaccines,
  getVaccinationsByCitizenId,
} from "../controllers/sharedController.js";

const router = express.Router();

router.use(authenticateRole("hcp"), authorize("hcp"));

router.get("/vaccines", getAllVaccines);
router.get("/vaccinations/:citizenId", getVaccinationsByCitizenId);
router.post("/add-vaccination", addVaccination);

router.get("/get/profile", getHCPProfile);
router.post("/profile/email/request", requestEmailChange);
router.post("/profile/email/verify", verifyEmailChange);

router.post("/profile/phone/request", requestPhoneChange);
router.post("/profile/phone/verify", verifyPhoneChange);

router.put("/profile/password", changePassword);

export default router;
