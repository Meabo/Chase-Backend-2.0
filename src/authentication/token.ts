import jwt from "jsonwebtoken"
import { configJwt } from "./config"

export const generateAccessToken = (userId) => {
  const expiresIn = '30 days';
  const issuer = configJwt.issuer;
  const audience = configJwt.audience;
  const secret = configJwt.jwtSecret;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString()
  });

  return token;
}