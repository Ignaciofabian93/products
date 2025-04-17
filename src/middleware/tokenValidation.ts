import jwt from "jsonwebtoken";

export const TokenValidation = async (token: string) => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    return decodedToken;
  } catch (error) {
    return null;
  }
};
