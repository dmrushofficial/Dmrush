import bcrypt from "bcryptjs";

const ROUNDS = 10;
const BCRYPT_RE = /^\$2[aby]\$/;

export function isPasswordHashed(value: string): boolean {
  return BCRYPT_RE.test(value);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, ROUNDS);
}

/** Verifies plaintext against stored hash or legacy plaintext. */
export async function verifyPassword(plain: string, stored: string): Promise<boolean> {
  if (!plain || !stored) return false;
  if (isPasswordHashed(stored)) {
    return bcrypt.compare(plain, stored);
  }
  // Legacy plaintext migration path
  return plain === stored;
}

export async function needsRehash(stored: string): Promise<boolean> {
  return !isPasswordHashed(stored);
}
