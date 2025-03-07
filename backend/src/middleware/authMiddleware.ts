import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface CustomNextApiRequest extends NextApiRequest {
  user?: any;
}

const supabaseJwtSecret = process.env.SUPABASE_JWT_SECRET as string;

export const verifyJwt = (req: CustomNextApiRequest, res: NextApiResponse, next: Function) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, supabaseJwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
};