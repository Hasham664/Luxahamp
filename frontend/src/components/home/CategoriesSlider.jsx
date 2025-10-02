'use client';

import { useEffect, useState } from 'react';
import api from '@/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import Image from 'next/image';
import Link from 'next/link';
import { useCategories } from './CategoryHook';

export default function CategoriesSlider() {
  const {loading, categories} = useCategories();

  return (
    <section className='w-full py-9'>
      <div className=' ml-6 sm:ml-12 text-center'>
        {/* Heading */}
        <h2 className='text-2xl md:text-3xl font-semibold mb-2 pt-10'>
          GIFTS BY CATEGORY
        </h2>
        <p className='text-[#333333] font-medium mb-8'>
          Explore our curated gift categories for effortless gifting tailored to
          every taste.
        </p>

        {/* Swiper */}
        <Swiper
          spaceBetween={20}
          slidesPerView={1.9}
          breakpoints={{
            700: { slidesPerView: 4.6 },
            1024: { slidesPerView: 6.8 },
          }}
          className='pb-6'
        >
          {loading
            ? // Skeleton loader
              Array.from({ length: 7 }).map((_, idx) => (
                <SwiperSlide key={idx}>
                  <div className='w-full h-48 rounded-lg bg-gray-200 animate-pulse' />
                  <div className='h-5 w-2/3 mx-auto mt-3 bg-gray-200 rounded animate-pulse' />
                </SwiperSlide>
              ))
            : // Categories
              categories.map((cat) => (
                <SwiperSlide key={cat._id}>
                  <Link href={`/${cat.slug}`} className='relative cursor-pointer group'>
                    {/* Image */}
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      width={300}
                      height={300}
                      className='object-cover w-full h-44 rounded-4xl shadow-md'
                    />

                    <div className='-mt-14 rounded-4xl h-26 transition-colors duration-300 bg-transparent flex items-start justify-center group-hover:bg-black'>
                      <p className='pt-16 text-base font-medium text-black transition-colors duration-300 group-hover:text-white'>
                        {cat.name}
                      </p>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
        </Swiper>
      </div>
    </section>
  );
}
