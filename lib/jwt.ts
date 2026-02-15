import { jwtVerify } from 'jose';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

interface MyTokenPayload {
  roles?: { roleName: string }[];
  userType?: string;
  sub?: string;
  iat?: number;
  exp?: number;
}

export async function verifyToken(token: string): Promise<MyTokenPayload> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    console.log('Decoded payload:', payload);
    return payload as MyTokenPayload;
  } catch (err: any) {
    console.error('JWT verification failed:', err.message);
    throw new Error('Invalid token');
  }
}
