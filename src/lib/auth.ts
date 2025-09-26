// src/lib/auth.ts
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mzbc_admin";


export function isAdmin(): boolean {
  const pass = process.env.ADMIN_PASSWORD || "mzbcwebsite";
  const c = cookies().get("mzbc_admin")?.value;
  return c === pass;
}


export function assertAdmin() {
  if (!isAdmin()) {
    const err = new Error("Unauthorized");
    (err as any).status = 401;
    throw err;
  }
}

export const ADMIN_COOKIE_OPTIONS = {
  httpOnly: true as const,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export function verifyAdminPassword(pass: string) {
  const target = process.env.ADMIN_PASSWORD || "mzbcwebsite";
  return pass === target;
}
