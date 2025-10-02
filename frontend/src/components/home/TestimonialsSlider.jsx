'use client';

import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs, Autoplay } from 'swiper/modules'; // ✅ import modules from swiper/modules
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import testi1 from '../../../public/images/testi1.png';

export default function TestimonialsSlider() {
  const testimonials = [
    {
      name: 'David S.',
      avatar: testi1,
      quote:
        'Perfect service, timely and stylish! Their team delivered my loved one’s gift. Will definitely recommend.',
    },
    {
      name: 'Sarah L.',
      avatar: testi1,
      quote:
        "I've never seen my wife happier than when she received her LuxaHamp™ gift. The attention to detail and luxurious presentation truly made her day special. Thank you for making gifting so effortless!",
    },
    {
      name: 'Amina K.',
      avatar: testi1,
      quote:
        'Amazing packaging and top-notch customer support. The product looked premium and arrived on time.',
    },
    {
      name: 'Omar R.',
      avatar: testi1,
      quote:
        'High quality and the little extras made the gift stand out. Will order again.',
    },
  ];

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className='py-12 bg-white'>
      <h2 className='text-center text-xl font-bold mb-8'>VOICES OF PRAISE</h2>

      <div className='max-w-4xl mx-auto px-4'>
        {/* Thumbnails row with custom nav */}
        <div className='relative'>
          <button
            ref={prevRef}
            aria-label='previous'
            className='hidden md:flex items-center justify-center absolute left-0 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-md'
          >
            <ArrowLeft size={18} />
          </button>

          <Swiper
            onSwiper={setThumbsSwiper}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={5}
            centeredSlides={true}
            loop={true}
            slideToClickedSlide={true}
            breakpoints={{
              320: { slidesPerView: 3 },
              640: { slidesPerView: 5 },
            }}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            className='testi-thumbs'
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className='flex justify-center'>
                <div className='avatar-wrapper w-16 h-16 md:w-16 md:h-16 rounded-full overflow-hidden flex items-center justify-center border-2 border-transparent'>
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={64}
                    height={64}
                    className='object-cover'
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          <button
            ref={nextRef}
            aria-label='next'
            className='hidden md:flex items-center justify-center absolute right-0 top-1/2 transform -translate-y-1/2 z-20 p-2 bg-white rounded-full shadow-md'
          >
            <ArrowRight size={18} />
          </button>
        </div>

        {/* Main testimonial swiper */}
        <Swiper
          modules={[Thumbs, Autoplay]}
          thumbs={{ swiper: thumbsSwiper }}
          autoplay={{ delay: 4500, disableOnInteraction: false }}
          loop={true}
          className='mt-8 testi-main'
        >
          {testimonials.map((t, idx) => (
            <SwiperSlide key={idx}>
              <div className='text-center px-4'>
                {/* large central avatar */}
                <div className='mx-auto w-28 h-28 md:w-28 md:h-28 rounded-full overflow-hidden mb-4 border-4 border-white shadow-xl'>
                  <Image
                    src={t.avatar}
                    alt={t.name}
                    width={112}
                    height={112}
                    className='object-cover'
                  />
                </div>

                {/* stars */}
                <div className='flex justify-center gap-1 mb-4'>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg
                      key={s}
                      width='18'
                      height='18'
                      viewBox='0 0 24 24'
                      fill='#F59E0B'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path d='M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z' />
                    </svg>
                  ))}
                </div>

                {/* quote */}
                <p className='text-gray-700 italic mb-4 max-w-2xl mx-auto leading-relaxed'>
                  "{t.quote}"
                </p>

                {/* name */}
                <h4 className='font-semibold'>{t.name}</h4>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx>{`
        .testi-thumbs :global(.swiper-slide) {
          transition: transform 250ms ease, opacity 250ms ease;
          opacity: 0.6;
          transform: scale(0.95);
        }
        .testi-thumbs :global(.swiper-slide-active) {
          opacity: 1;
          transform: scale(1.15);
        }
        .testi-thumbs .avatar-wrapper {
          transition: transform 250ms ease, border-color 250ms ease;
        }
        .testi-thumbs :global(.swiper-slide-active) .avatar-wrapper {
          border-color: #fce7f3;
        }
      `}</style>
    </div>
  );
}
