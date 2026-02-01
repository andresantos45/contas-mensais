export interface JwtPayload {
  exp: number;
  role: "admin" | "user";
}