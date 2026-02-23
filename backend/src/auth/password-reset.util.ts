import { createHash, randomBytes } from 'crypto';

export function generateResetToken(bytes = 32): string {
  // token plano que se envía al usuario
  return randomBytes(bytes).toString('hex');
}

export function hashToken(token: string): string {
  // guardamos SOLO el hash en DB
  return createHash('sha256').update(token).digest('hex');
}
