import jwt from 'jsonwebtoken';
import asyncHandler from '../middlewere/asyncHandler.js';

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email, role: 'admin' }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });
    return res.json({ success: true, token });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});
