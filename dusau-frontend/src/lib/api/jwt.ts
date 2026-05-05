import { jwtVerify, SignJWT } from 'jose';
import { ADMIN_SESSION_HOURS, getJwtSecret } from './config';

const encoder = new TextEncoder();

function getSecretKey() {
  return encoder.encode(getJwtSecret());
}

export type AdminJwtPayload = {
  sessionId: string;
  organizationId: number;
};

export async function signAdminJwt(payload: AdminJwtPayload) {
  return new SignJWT({ organizationId: payload.organizationId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sessionId)
    .setJti(payload.sessionId)
    .setIssuedAt()
    .setExpirationTime(`${ADMIN_SESSION_HOURS}h`)
    .sign(getSecretKey());
}

export async function verifyAdminJwt(token: string): Promise<AdminJwtPayload> {
  const result = await jwtVerify(token, getSecretKey(), {
    algorithms: ['HS256'],
  });

  const sessionId = result.payload.sub;
  const organizationId = result.payload.organizationId;

  if (!sessionId || typeof organizationId !== 'number') {
    throw new Error('Invalid admin token payload.');
  }

  return { sessionId, organizationId };
}
