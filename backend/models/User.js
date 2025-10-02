// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true }, // hashed in controller
    isVerified: { type: Boolean, default: false },
    photo: { type: String, default: '' }, // cloudinary url
    description: { type: String, default: '' },

    // verification / reset tokens (hashed)
    verificationTokenHash: String,
    verificationTokenExpires: Date,

    resetPasswordTokenHash: String,
    resetPasswordTokenExpires: Date,
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);
export default User;