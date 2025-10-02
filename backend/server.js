import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import 'dotenv/config.js';
import connectDB from './utils/db.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import heroRoutes from './routes/heroRoute.js';
import cartRoutes from './routes/cartRoutes.js';
import favoritesRoutes from './routes/favoritesRoutes.js';
import { errorHandler } from './middlewere/errorHandler.js';

const app = express();
const port = process.env.PORT || 4000;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Allow credentials for cookies
const allowedOrigins = [
  'http://localhost:3000', // frontend
  'http://localhost:3001', // admin
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps or curl)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);


// ✅ Mount routes before error handler
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/review', reviewRoutes);
app.use('/api/v1/heroes', heroRoutes);
app.use('/api/v1/cart', cartRoutes );
app.use('/api/v1/favorites', favoritesRoutes);
// ✅ Custom error handler must be last
app.use(errorHandler);

connectDB();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
