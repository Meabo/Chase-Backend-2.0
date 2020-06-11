import jwt from "jsonwebtoken";
import { configJwt } from "./config";
import axios from "axios";
import { JwtToken } from "../interfaces/customInterfaces"

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

export const verifyAccessToken = async (encodedToken: string) => {
 const promisedDecodedToken: Promise<JwtToken> =  new Promise((resolve, reject) => {
   if (!encodedToken || encodedToken.length === 0) reject("Error empty jwtToken")
        jwt.verify(encodedToken, configJwt.jwtSecret, (err, decoded: JwtToken) => {
          if (err) {
            console.log('JwtToken is missing', err)
            reject(err);
          }
          resolve(decoded);
        })
  })
  return await promisedDecodedToken;
}

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
