import { configureStore } from '@reduxjs/toolkit';
import productReducer from './product/productSlice';

export const store = configureStore({
  reducer: {
    products: productReducer, // ✅ key must match what you use in useSelector
  },
});
