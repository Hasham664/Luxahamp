'use client';

import { Crown, Truck, Headset } from 'lucide-react';

export default function OurPromise() {
  const items = [
    {
      icon: <Crown size={32} />,
      title: 'Unbeatable Quality',
      desc: 'Experience luxury without compromise with our commitment to impeccable quality in every product.',
    },
    {
      icon: <Truck size={32} />,
      title: 'Delivery To Your Door',
      desc: 'Experience the convenience of luxury with our seamless doorstep delivery service.',
    },
    {
      icon: <Headset size={32} />,
      title: 'All The Help You Need',
      desc: 'From selection to customization, we’re here to assist you every step of the way.',
    },
  ];

  return (
    <section className='w-full py-16 bg-white'>
      <div className='Mycontainer text-center'>
        <h2 className='text-2xl md:text-4xl font-semibold mb-10'>
          OUR PROMISE
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-10'>
          {items.map((item, i) => (
            <div
              key={i}
              className='flex flex-col items-center text-center '
            >
              <div className='mb-4 text-black'>{item.icon}</div>
              <h3 className='text-lg font-semibold mb-2'>{item.title}</h3>
              <p className='text-[#333333] text-base font-medium'>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
