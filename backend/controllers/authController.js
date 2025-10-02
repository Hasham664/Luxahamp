// controllers/authController.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateRandomToken, hashToken } from '../utils/token.js';
import User from '../models/User.js';
import asyncHandler from '../middlewere/asyncHandler.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js'; 
import sendEmail from '../utils/sendEmail.js';

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'; 
const AUTH_COOKIE_MAX_AGE =
  Number(process.env.AUTH_COOKIE_MAX_AGE) || 7 * 24 * 60 * 60 * 1000; 

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'Lax',
  maxAge: AUTH_COOKIE_MAX_AGE,
};

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, description } = req.body;

  if (!name || !email || !password || !confirmPassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'Please provide name, email, password and confirmPassword',
      });
  }

  if (password !== confirmPassword) {
    return res
      .status(400)
      .json({ success: false, message: 'Passwords do not match' });
  }

  const existing = await User.findOne({ email });
  if (existing)
    return res
      .status(400)
      .json({ success: false, message: 'Email already registered' });

  // hash password here (controller)
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    description: description || '',
  });

  // create short lived verification token (5 minutes)
  const rawToken = generateRandomToken(20);
  const hashed = hashToken(rawToken);
  user.verificationTokenHash = hashed;
  user.verificationTokenExpires = Date.now() + 5 * 60 * 1000; // 5 minutes
  await user.save();

  // build verification link
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
const verifyUrl = `${frontendUrl}/verify?token=${rawToken}&email=${encodeURIComponent(
  email
)}`;


  // send email (simple html)
  await sendEmail({
    to: user.email,
    subject: 'Verify your Luxahamp account',
    html: `<p>Hi ${user.name},</p>
      <p>Click the link below to verify your account (link expires in 5 minutes):</p>
      <a href="${verifyUrl}">${verifyUrl}</a>
      <p>If you didn't create an account, ignore this email.</p>`,
  });

  // do not log user in until verified - return minimal response
  res
    .status(201)
    .json({ success: true, message: 'User created. Verification email sent.' });
});

// ------------------ verify email ------------------
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token, email } = req.query; // prefer POST; frontend can POST token+email

  if (!token || !email)
    return res.status(400).json({ success: false, message: 'Invalid request' });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid token or user' });

  if (!user.verificationTokenHash || !user.verificationTokenExpires) {
    return res
      .status(400)
      .json({
        success: false,
        message: 'No verification token found. Request a new one.',
      });
  }

  if (Date.now() > user.verificationTokenExpires.getTime()) {
    // remove tokens immediately
    user.verificationTokenHash = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return res
      .status(400)
      .json({
        success: false,
        message: 'Verification token expired. Request a new one.',
      });
  }

  const hashed = hashToken(token);
  if (hashed !== user.verificationTokenHash) {
    return res.status(400).json({ success: false, message: 'Invalid token' });
  }

  user.isVerified = true;
  user.verificationTokenHash = undefined;
  user.verificationTokenExpires = undefined;
  await user.save();

  res.json({ success: true, message: 'Email verified successfully' });
});

// ------------------ login ------------------
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: 'Please provide email and password' });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch)
    return res
      .status(400)
      .json({ success: false, message: 'Invalid credentials' });

  if (!user.isVerified) {
    return res
      .status(403)
      .json({
        success: false,
        message: 'Please verify your email before logging in',
      });
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });

  // set httpOnly cookie
  res.cookie('token', token, cookieOptions);

  res.json({
    success: true,
    message: 'Logged in',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        description: user.description,
      },
    },
  });
});

// ------------------ logout ------------------
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });
  res.json({ success: true, message: 'Logged out' });
});

// ------------------ forgot password ------------------
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email)
    return res
      .status(400)
      .json({ success: false, message: 'Please provide email' });

  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(200)
      .json({
        success: true,
        message: ' a reset link has been sent',
      });

  // create reset token (5 min)
  const rawToken = generateRandomToken(20);
  user.resetPasswordTokenHash = hashToken(rawToken);
  user.resetPasswordTokenExpires = Date.now() + 5 * 60 * 1000;
  await user.save();

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const resetUrl = `${frontendUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(
    user.email
  )}`;

  await sendEmail({
    to: user.email,
    subject: 'Reset your Luxahamp password',
    html: `<p>Hi ${user.name},</p>
      <p>Use the link below to reset your password (link expires in 5 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>`,
  });

  // always respond success to avoid leaking existing emails
  res.json({
    success: true,
    message: 'If that email exists, a reset link has been sent',
  });
});

// ------------------ reset password ------------------
export const updatetPassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  const user = await User.findById(req.user?.id); // req.user set by auth middleware

  if (!(await bcrypt.compare(currentPassword, user.password)))
    return res
      .status(400)
      .json({ success: false, message: 'Wrong current password' });

  if (newPassword !== confirmPassword)
    return res
      .status(400)
      .json({ success: false, message: 'Passwords do not match' });

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  res.json({ success: true, message: 'Password changed successfully' });
});

// ------------------ update profile (photo + description) ------------------
export const updateProfile = asyncHandler(async (req, res) => {
  // this route expects authentication middleware to set req.user (or pass user id in body)
  const userId = req.user?.id || req.body.userId;
  if (!userId)
    return res.status(401).json({ success: false, message: 'Unauthorized' });

  const user = await User.findById(userId);
  if (!user)
    return res.status(404).json({ success: false, message: 'User not found' });

  // description update
  if (req.body.description !== undefined) {
    user.description = req.body.description;
  }

  // photo upload - expects multer to have populated req.file (field name 'photo')
  if (req.file) {
    // upload to cloudinary using provided util
    const localPath = req.file.path;
    const result = await uploadOnCloudinary(localPath, {
      folder: `luxahamp/users/${user._id}`,
      transformation: { width: 800, crop: 'limit' },
    });

    if (result?.secure_url) {
      user.photo = result.secure_url;
    }
    // optional: remove local file, but your multer is diskStorage; remove if desired
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profile updated',
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        photo: user.photo,
        description: user.description,
      },
    },
  });
});
