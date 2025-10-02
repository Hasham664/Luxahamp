import { useEffect, useState } from 'react';
import api from '@/api';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

   useEffect(() => {
     const fetchCategories = async () => {
       try {
         const res = await api.get('/categories');
         const cats = Array.isArray(res.data)
           ? res.data
           : res.data.categories || [];
         setCategories(cats);
       } catch (err) {
         console.error('Failed to fetch categories', err);
       } finally {
         setLoading(false);
       }
     };

     fetchCategories();
   }, []);

  return { categories, loading };
}
