import express from "express";
import {
  loginCitizen,
  logoutCitizen,
} from "../controllers/auth/citizenAuthController.js";
import { loginHCP, logoutHCP } from "../controllers/auth/hcpAuthController.js";
import {
  loginHospital,
  logoutHospital,
} from "../controllers/auth/hospitalAuthController.js";
import { loginMOH, logoutMOH } from "../controllers/auth/mohAuthController.js";
import {
  loginAdmin,
  logoutAdmin,
} from "../controllers/auth/adminAuthController.js";

const router = express.Router();

router.post("/login/admin", loginAdmin);
router.post("/logout/admin", logoutAdmin);

router.post("/login/citizen", loginCitizen);
router.post("/logout/citizen", logoutCitizen);

router.post("/login/hcp", loginHCP);
router.post("/logout/hcp", logoutHCP);

router.post("/login/hospital", loginHospital);
router.post("/logout/hospital", logoutHospital);

router.post("/login/moh", loginMOH);
router.post("/logout/moh", logoutMOH);

export default router;
