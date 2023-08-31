import { Router } from "express";
import usercontroller from "../controllers/user.controller";

const router = Router();

router.get("/users", usercontroller.getUsers);

router.post("/register", usercontroller.register);

router.post("/login", usercontroller.login);

export default router;
