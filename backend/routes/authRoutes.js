// routes/authRoutes.js
import express from 'express';
import {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  updateProfile,
  updatetPassword,
} from '../controllers/authController.js';
import isAuthenticated from '../middlewere/isAuthenticated.js';
import upload from '../middlewere/multer.js'; // you said multer is in middleware folder as multer

const router = express.Router();

// public
router.post('/signup', signup); // body: name,email,password,confirmPassword,description
// router.post('/verify', verifyEmail); 
router.get('/verify', verifyEmail);

router.post('/login', login); // body: email,password
router.post('/forgot-password', forgotPassword); // body: email
router.post('/update-password', isAuthenticated, updatetPassword); // body: token,newPassword,confirmPassword

// protected
router.post('/logout', isAuthenticated, logout);
router.put('/me', isAuthenticated, upload.single('photo'), updateProfile); // form-data: photo + description

export default router;
