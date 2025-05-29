import jwt from "jsonwebtoken";

export function decodeClerkToken(token: string) {
  const decoded = jwt.decode(token);

  if (!decoded || typeof decoded !== "object") {
    throw new Error("Invalid token");
  }

  const userId = decoded.sub;

  if (!userId) {
    throw new Error("User ID not found in token");
  }

  return userId;
}
