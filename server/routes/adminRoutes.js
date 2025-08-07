import express from "express";
import {
  registerPatient,
  getAllPatients,
  getPatientByCitizenId,
  updatePatientByCitizenId,
  deletePatientByCitizenId,
} from "../controllers/patientAdminController.js";
import {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  updateHospitalById,
  deleteHospitalById,
} from "../controllers/hospitalAdminController.js";
import {
  registerMOH,
  getAllMOHs,
  getMOHById,
  updateMOHById,
  deleteMOHById,
} from "../controllers/mohAdminController.js";
import {
  registerHCP,
  getAllHCPs,
  getHCPById,
  updateHCPById,
  deleteHCPById,
} from "../controllers/hcpAdminController.js";
import {
  addVaccination,
  getAllVaccinations,
  getVaccinationsByCitizenId,
  getVaccinationById,
  updateVaccinationById,
  deleteVaccinationById,
} from "../controllers/vaccinationAdminController.js";
import {
  registerVaccine,
  getAllVaccines,
  getVaccineById,
  updateVaccineById,
  deleteVaccineById,
} from "../controllers/vaccineAdminController.js";
import {
  changePassword,
  getAdminProfile,
  getAllAdmins,
  registerAdmin,
} from "../controllers/adminController.js";
import { authenticateRole, authorize } from "../middleware/auth.js";

const router = express.Router();

router.use(authenticateRole("admin"), authorize("admin"));

// admin management
router.post("/register-admin", registerAdmin);
router.get("/admins", getAllAdmins);

router.get("/get/profile", getAdminProfile);
router.put("/profile/password", changePassword);

// patient management
router.post("/register-patient", registerPatient);
router.get("/patients", getAllPatients);
router.get("/patient/:citizenId", getPatientByCitizenId);
router.put("/patient/:citizenId", updatePatientByCitizenId);
router.delete("/patient/:citizenId", deletePatientByCitizenId);

// hospital management
router.post("/register-hospital", registerHospital);
router.get("/hospitals", getAllHospitals);
router.get("/hospital/:hospitalId", getHospitalById);
router.put("/hospital/:hospitalId", updateHospitalById);
router.delete("/hospital/:hospitalId", deleteHospitalById);

// moh management
router.post("/register-moh", registerMOH);
router.get("/mohs", getAllMOHs);
router.get("/moh/:mohId", getMOHById);
router.put("/moh/:mohId", updateMOHById);
router.delete("/moh/:mohId", deleteMOHById);

// healthcare provider management
router.post("/register-hcp", registerHCP);
router.get("/hcps", getAllHCPs);
router.get("/hcp/:hcpId", getHCPById);
router.put("/hcp/:hcpId", updateHCPById);
router.delete("/hcp/:hcpId", deleteHCPById);

// vaccination record management
router.post("/add-vaccination", addVaccination);
router.get("/vaccinations", getAllVaccinations);
router.get("/vaccinations/:citizenId", getVaccinationsByCitizenId);
router.get("/vaccination/:vaccinationId", getVaccinationById);
router.put("/vaccination/:vaccinationId", updateVaccinationById);
router.delete("/vaccination/:vaccinationId", deleteVaccinationById);

// vaccine management
router.post("/register-vaccine", registerVaccine);
router.get("/vaccines", getAllVaccines);
router.get("/vaccine/:vaccineId", getVaccineById);
router.put("/vaccine/:vaccineId", updateVaccineById);
router.delete("/vaccine/:vaccineId", deleteVaccineById);

export default router;
