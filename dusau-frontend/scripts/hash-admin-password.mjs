import { randomBytes, scrypt as scryptCallback } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-admin-password.mjs "YourStrongPassword"');
  process.exit(1);
}

const salt = randomBytes(16).toString('hex');
const key = await scrypt(password, salt, 64);
console.log(`scrypt$${salt}$${Buffer.from(key).toString('hex')}`);
