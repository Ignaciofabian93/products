import jwt, { type JwtPayload } from "jsonwebtoken";

export const TokenValidation = (token: string): string | jwt.JwtPayload | null => {
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
    if (decodedToken) {
      return decodedToken.userId;
    } else {
      return null;
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log("Error verifying token:", error);
    return null;
  }
};
