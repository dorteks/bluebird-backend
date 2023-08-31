import jwt from "jsonwebtoken";
import { config } from "../../configs";

export const verifyToken = (req: any, res: any, next: any) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.sendStatus(403);
  }
};

export const authenticate = (req: any, res: any, next: any) => {
  const accessToken = req.headers["authorization"].split(" ")[1];
  const cookies = req.cookies;
  const refreshToken = cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).send("Access Denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(accessToken, config.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("Invalid Token.");
  }

  // try {
  //   const decoded = jwt.verify(refreshToken, config.secret);

  //   const accessToken = jwt.sign({ user: "user" }, config.secret, {
  //     expiresIn: "1h",
  //   });

  //   res.header("Authorization", accessToken).send(decoded);
  // } catch (error) {
  //   console.log(error);
  //   return res.status(400).send("Invalid refresh token entered.");
  // }
};
