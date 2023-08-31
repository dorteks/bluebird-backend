import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getPosts = async (req: any, res: any) => {
  res.send("fetch all posts");
};

const createPost = async (req: any, res: any) => {
  res.json({
    message: "whatever",
  });
};

export default { getPosts, createPost };
