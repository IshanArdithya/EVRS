import express from "express";
import {
  requestPhoneChange,
  verifyPhoneChange,
  changePassword,
  addVaccination,
  registerPatient,
  getHospitalProfile,
} from "../controllers/hospitalController.js";
import { authenticateRole, authorize } from "../middleware/auth.js";
import {
  getAllVaccines,
  getVaccinationsByCitizenId,
} from "../controllers/sharedController.js";

const router = express.Router();

router.use(authenticateRole("hospital"), authorize("hospital"));

router.get("/vaccines", getAllVaccines);
router.get("/vaccinations/:citizenId", getVaccinationsByCitizenId);
router.post("/add-vaccination", addVaccination);
router.post("/register-patient", registerPatient);

router.get("/get/profile", getHospitalProfile);
router.post("/profile/phone/request", requestPhoneChange);
router.post("/profile/phone/verify", verifyPhoneChange);

router.put("/profile/password", changePassword);

export default router;
