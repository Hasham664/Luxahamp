import React from 'react';
import Image from 'next/image';
import group from '../../../public/images/group.png';
import { ArrowRight } from 'lucide-react';

const GiftHappiness = () => {
  return (
    <div className='Mycontainer'>
      <section className='grid grid-cols-1 md:grid-cols-2 gap-10 py-20 items-center'>
        {/* Left Column - Text Content */}
        <div className=''>
          <h4 className='font-medium text-black tracking-[2px]'>
            GIVE A GIFT THAT MAKES FACES SMILE
          </h4>
          <h1 className='text-black text-2xl md:text-[42px] font-bold pt-2 pb-4'>
            Gift Happiness, Spread Joy
          </h1>
          <p className='text-black text-base md:text-lg  pb-12'>
            Make every occasion memorable with Luxahamp's curated hampers that
            bring smiles to faces. From luxurious treats to thoughtful gifts,
            our hampers are sure to delight your loved ones.
          </p>
          <button className='flex items-center gap-2 px-6 py-3 lg:py-5 bg-black text-white text-base md:text-lg font-medium tracking-[3px] cursor-pointer'>
            SHOP GIFTS HAMPER
            <ArrowRight size={20} />
          </button>
        </div>

        {/* Right Column - Group Image */}
        <div className='flex justify-center'>
          <Image
            src={group}
            alt='Group'
            width={600}
            height={500}
            className='w-full max-w-[600px] h-auto'
          />
        </div>
      </section>
    </div>
  );
};

export default GiftHappiness;
