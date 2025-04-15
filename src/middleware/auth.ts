import jwt, { JwtPayload } from "jsonwebtoken";

export const tokenVerify = async (token: string) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
  const id = decodedToken.userId;
  return id;
};
