import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, verifyToken } from "../middleware/auth/jwtAuth";
import postController from "../controllers/post.controller";

const router = Router();
const prisma = new PrismaClient();

router.get("/posts", postController.getPosts);

router.post("/post", authenticate, postController.createPost);

export default router;
