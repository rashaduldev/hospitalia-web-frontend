import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET || 'your-secret';

export function verifyToken(token: string) {
  try {
    const decoded = jwt.verify(token, SECRET);
    return decoded as any;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
