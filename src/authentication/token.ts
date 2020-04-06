import jwt from "jsonwebtoken";
import { configJwt } from "./config";
import axios from "axios";

export const generateAccessToken = (userId) => {
  const expiresIn = "30 days";
  const issuer = configJwt.issuer;
  const audience = configJwt.audience;
  const secret = configJwt.jwtSecret;

  const token = jwt.sign({}, secret, {
    expiresIn: expiresIn,
    audience: audience,
    issuer: issuer,
    subject: userId.toString(),
  });

  return token;
};

export const verifyFacebookToken = async (facebookAccessToken: string) => {
  const graphUrl = `https://graph.facebook.com/v6.0/debug_token?input_token=${facebookAccessToken} 
  &access_token=${process.env.FACEBOOK_ID}|${process.env.FACEBOOK_SECRET}`;
  try {
      const response =  await axios.get(graphUrl);
      return response.data;
  } catch (err) {
      throw err;
  }
};
