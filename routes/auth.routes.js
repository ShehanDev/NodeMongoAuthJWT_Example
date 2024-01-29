import express from "express";
import {
  checkDuplicationUserNameOrEmail,
  checkRolesExisted,
} from "../middleware/verifySignUp.js ";
import { signUp, signIn } from "../controllers/auth.controllers.js";
//initializing routes
const router = express.Router();

//signin up/Register routes
router.post(
  "/signup",
  [checkDuplicationUserNameOrEmail, checkRolesExisted],
  signUp
);
//login
router.post("/signin", signIn);
export default router;
