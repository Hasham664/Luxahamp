import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token)
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Access denied' });

    // ✅ Provide _id so Review.create has a user field
    req.user = {
      _id: decoded.id, // must match your token payload key
      role: 'admin',
      email: decoded.email || '',
    };

    next();
  } catch (err) {
    return res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token' });
  }
};
