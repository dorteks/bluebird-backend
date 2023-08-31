import "dotenv/config";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";
import { config } from "./configs";
import user from "./routes/user.route";
import post from "./routes/post.route";
import cookieParser from "cookie-parser";
import { authenticate, verifyToken } from "./middleware/auth/jwtAuth";

const app = express();

app.use(express.json());
app.use(cookieParser("", {}));

app.use(user, post);

// app.use(cors);

app.use(
  cors({
    origin: "*",
  })
);

app.get("/server-check", async (req, res) => {
  res.send("🚀 Typescript Node Express server");
});

// code okay
app.post("/api/protected", verifyToken, (req: any, res: any) => {
  jwt.verify(req.token, config.secret, (err: any, data: any) => {
    if (err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: "this route is protected",
        data: data,
      });
    }
  });
});

// refresh okay
app.post("/refresh", (req: any, res: any) => {
  const cookies = req.cookies;

  if (!cookies.refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(cookies.refreshToken, config.secret);

    const accessToken = jwt.sign({ user: "user" }, config.secret, {
      expiresIn: "1h",
    });

    res.json({ accessToken, decoded });
    // res.header("Authorization", accessToken).send(decoded);
  } catch (error) {
    console.log(error);
    return res.status(400).send("Invalid refresh token entered.");
  }
});

const server = app.listen(3010, () =>
  console.log(`
🚀 Server ready at: http://localhost:3010`)
);
