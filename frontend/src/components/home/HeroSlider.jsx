'use client';

import { useEffect, useState, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import api from '@/api';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const [heroData, setHeroData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const res = await api.get('/heroes');
        setHeroData(res.data);
      } catch (err) {
        console.error('Failed to fetch hero data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchHero();
  }, []);

  if (loading) {
    return (
      <section className='w-full relative min-h-screen'>
        {/* Background skeleton */}
        <div className='absolute inset-0 bg-gray-300 animate-pulse' />

        {/* Text skeleton */}
        <div className='absolute inset-0 flex items-center'>
          <div className='container mx-auto px-6 md:px-12 lg:px-20 text-left space-y-4'>
            <div className='h-10 bg-gray-400 rounded w-1/2 animate-pulse'></div>
            <div className='h-6 bg-gray-400 rounded w-1/2 animate-pulse'></div>
            <div className='h-10 bg-gray-400 rounded w-32 animate-pulse'></div>
          </div>
        </div>
      </section>
    );
  }

  if (!heroData || heroData.length === 0) return null;

  // Flatten images from all heroData
  const slides = heroData.flatMap((hero) =>
    hero.images.map((img) => ({
      ...hero,
      image: img,
    }))
  );

  return (
    <section className='w-full relative min-h-screen'>
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        className='w-full min-h-screen'
      >
        {slides.map((hero, index) => (
          <SwiperSlide key={index}>
            <div className='relative w-full min-h-screen'>
              {/* Background Image */}
              <Image
                src={hero.image}
                alt={`Hero image ${index + 1}`}
                fill
                className='object-cover'
                priority={index === 0}
              />

              {/* Overlay Text */}
              <div className='absolute inset-0 flex items-center '>
                <div className='Mycontainer text-left text-white'>
                  <h4 className='pt-6 pb-1'>{hero.name}</h4>
                  <h1 className='text-4xl md:text-6xl font-medium mb-4 max-w-3xl'>
                    {hero.title}
                  </h1>
                  <p className='text-lg mb-6 max-w-2xl'>{hero.description}</p>
                  <Link
                    href='#'
                    className='inline-flex items-center gap-1 text-base uppercase tracking-[2px]
               font-normal underline'
                  >
                    {hero.button}
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Progress Bar */}
      <div className='absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-50'>
        {slides.map((_, i) => (
          <div
            key={i}
            className='h-[3px] w-10 bg-gray-300 overflow-hidden rounded'
          >
            <div
              className={`h-full bg-black ${
                i === activeIndex ? 'animate-progress' : 'w-0'
              }`}
            />
          </div>
        ))}
      </div>

      {/* Progress animation style */}
      <style jsx>{`
        .animate-progress {
          width: 100%;
          transition: width 3s linear;
        }
      `}</style>
    </section>
  );
}
