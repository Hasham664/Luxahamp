import asyncHandler from '../middlewere/asyncHandler.js';
import Hero from '../models/Hero.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// Create a new hero component
export const createHero = asyncHandler(async (req, res) => {
  const { name, title, description, button } = req.body;

  // Handle image uploads to Cloudinary
  const images = [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) {
        images.push(result.secure_url);
      }
    }
  }

  const hero = new Hero({
    name,
    title,
    description,
    button,
    images,
  });

  const createdHero = await hero.save();
  res.status(201).json(createdHero);
});

// Get all hero components
export const getHeroes = asyncHandler(async (req, res) => {
  const heroes = await Hero.find({});
  res.json(heroes);
});

// Get a single hero component by ID
// export const getHeroById = asyncHandler(async (req, res) => {
//   const hero = await Hero.findById(req.params.id);
//   if (hero) {
//     res.json(hero);
//   } else {
//     res.status(404);
//     throw new Error('Hero component not found');
//   }
// });

// Update a hero component by ID
// Update a hero component by ID
export const updateHero = asyncHandler(async (req, res) => {
  const { name, title, description, button, existingImages = [] } = req.body;
  const hero = await Hero.findById(req.params.id);
  if (!hero) {
    res.status(404);
    throw new Error('Hero component not found');
  }


  hero.name = name || hero.name;
  hero.title = title || hero.title;
  hero.description = description || hero.description;
  hero.button = button || hero.button;

  // Keep only images the user kept + any new uploads
  let images = Array.isArray(existingImages) ? existingImages : [];
  if (req.files && req.files.length > 0) {
    for (const file of req.files) {
      const result = await uploadOnCloudinary(file.path);
      if (result) images.push(result.secure_url);
    }
  }
  hero.images = images;

  const updatedHero = await hero.save();
  res.json(updatedHero);
});


// Delete a hero component by ID
export const deleteHero = asyncHandler(async (req, res) => {
  const hero = await Hero.findById(req.params.id);
  if (hero) {
    await hero.deleteOne();
    res.json({ message: 'Hero component removed' });
  } else {
    res.status(404);
    throw new Error('Hero component not found');
  }
});