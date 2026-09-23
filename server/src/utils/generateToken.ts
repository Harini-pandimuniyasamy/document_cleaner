import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET || process.env.JWT_TOKEN || 'docuclean_ai_production_secret_key_2026';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d',
  });
};
