import express from "express";
import {
  loginCitizen,
  logoutCitizen,
  getCitizenProfile,
} from "../controllers/auth/citizenAuthController.js";
import {
  getHCPProfile,
  loginHCP,
  logoutHCP,
} from "../controllers/auth/hcpAuthController.js";
import {
  getHospitalProfile,
  loginHospital,
  logoutHospital,
} from "../controllers/auth/hospitalAuthController.js";
import {
  getMOHProfile,
  loginMOH,
  logoutMOH,
} from "../controllers/auth/mohAuthController.js";
import {
  getAdminProfile,
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth/adminAuthController.js";

const router = express.Router();

router.post("/login/admin", loginAdmin);
router.post("/logout/admin", logoutAdmin);
router.get("/get/admin", getAdminProfile);

router.post("/login/citizen", loginCitizen);
router.post("/logout/citizen", logoutCitizen);
router.get("/get/citizen", getCitizenProfile);

router.post("/login/hcp", loginHCP);
router.post("/logout/hcp", logoutHCP);
router.get("/get/hcp", getHCPProfile);

router.post("/login/hospital", loginHospital);
router.post("/logout/hospital", logoutHospital);
router.get("/get/hospital", getHospitalProfile);

router.post("/login/moh", loginMOH);
router.post("/logout/moh", logoutMOH);
router.get("/get/moh", getMOHProfile);

export default router;
