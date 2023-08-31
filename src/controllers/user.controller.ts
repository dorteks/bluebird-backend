import jwt from "jsonwebtoken";
import { config } from "../configs/index";
import { PrismaClient } from "@prisma/client";
import { compareHash, generateHash } from "../utils/bcryptUtils";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const getUsers = async (req: any, res: any) => {
  const users = await prisma.user.findMany();
  res.send(users);
};

const register = async (req: any, res: any) => {
  const { email, name, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    });

    if (user) {
      res.send(`user with email ${req.body.email} already exist`);
      return;
    }

    const hashPassword = await generateHash(password);

    const register = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });
    return res.send(register);
  } catch (error) {
    console.log(error);
    res.status(500).send("error creating user");
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
      select: { password: true, id: true },
    });

    if (!user) {
      return res.send("user not found");
    }

    const passwordMatch = await compareHash(req.body.password, user.password);

    if (!passwordMatch) {
      return res.send("incorrect credentials");
    } else {
      // signing token with user id
      const acessToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 240,
      });
      const refreshToken = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: "1h",
      });

      res
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          sameSite: "strict",
        })
        .header("Authorization", acessToken)
        .json({
          user,
          message: "Login successful",
          acessToken,
          refreshToken,
        });
    }
  } catch (error) {
    throw error;
  }
};

export default { getUsers, register, login };
