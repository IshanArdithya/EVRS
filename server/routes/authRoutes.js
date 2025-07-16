import express from "express";
import {
  loginCitizen,
  logoutCitizen,
  getCitizenProfile,
} from "../controllers/auth/citizenAuthController.js";
import { loginHCP } from "../controllers/auth/hcpAuthController.js";
import { loginHospital } from "../controllers/auth/hospitalAuthController.js";
import { loginMOH } from "../controllers/auth/mohAuthController.js";

const router = express.Router();

router.post("/login/citizen", loginCitizen);
router.post("/logout/citizen", logoutCitizen);
router.get("/get/citizen", getCitizenProfile);

router.post("/login/hcp", loginHCP);

router.post("/login/hospital", loginHospital);

router.post("/login/moh", loginMOH);

export default router;
