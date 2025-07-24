import express from "express";
import {
  getAllVaccines,
  getVaccinationsByCitizenId,
  addVaccination,
  registerPatient,
} from "../controllers/sharedController.js";

const router = express.Router();

router.get("/vaccines", getAllVaccines);
router.get("/vaccinations/:citizenId", getVaccinationsByCitizenId);
router.post("/add-vaccination", addVaccination);
router.post("/register-patient", registerPatient);

export default router;
