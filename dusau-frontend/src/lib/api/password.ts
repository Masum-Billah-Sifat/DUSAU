import { scrypt as scryptCallback, timingSafeEqual, randomBytes } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long.');
  }

  const salt = randomBytes(16).toString('hex');
  const key = (await scrypt(password, salt, KEY_LENGTH)) as Buffer;
  return `scrypt$${salt}$${key.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [scheme, salt, keyHex] = storedHash.split('$');
  if (scheme !== 'scrypt' || !salt || !keyHex) return false;

  const expectedKey = Buffer.from(keyHex, 'hex');
  const actualKey = (await scrypt(password, salt, expectedKey.length)) as Buffer;

  if (actualKey.length !== expectedKey.length) return false;
  return timingSafeEqual(actualKey, expectedKey);
}
