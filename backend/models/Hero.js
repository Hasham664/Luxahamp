import mongoose from 'mongoose';

const heroSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    button: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String, // Store Cloudinary URLs
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Hero = mongoose.model('Hero', heroSchema);

export default Hero;
