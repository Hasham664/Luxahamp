'use client';

import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function ReusableCard({
  miniTitle,
  title,
  listItems,
  image,
  bgColor,
  buttonText,
  des,
  reverse = false, // condition for layout
}) {
  return (
    <div
      className={` overflow-hidden shadow-md flex flex-col md:flex-row ${
        reverse ? 'md:flex-row-reverse' : ''
      }`}
      style={{ backgroundColor: bgColor }}
    >
      {/* Image */}
      <div className='w-full md:w-1/2'>
        <Image src={image} alt={title} className='h-full w-full object-cover' />
      </div>

      {/* Content */}
      <div
        className={`flex flex-col justify-center md:w-1/2 ${
          reverse ? ' px-5 md:pl-16' : ' px-5 md:pl-28'
        }`}
      >
        {miniTitle && <p className='font-medium max-md:pt-4 md:pb-4'>{miniTitle}</p>}
        <h2 className=' max-md:pt-4 text-2xl md:text-5xl font-bold mb-2'>{title}</h2>

        {/* List */}
        <ul className='mb-4 text-sm space-y-1'>
          {listItems?.map((item, i) => (
            <li key={i} className='flex items-center gap-2 py-1'>
              {reverse ? (
                // numbered list style
                <span className='text-lg font-semibold'>{i + 1}.</span>
              ) : (
                // bullet list style
                <span className='w-2 h-2 bg-black rounded-full' />
              )}
              <p className='text-[#4F4F4F] text-lg'>{item}</p>
            </li>
          ))}
        </ul>

        
          <p className='text-base font-medium max-w-lg pt-4 pb-7'>{des}</p>
        

        <button className=' max-md:mb-10 tracking-[2px] cursor-pointer flex items-center gap-2 px-6 w-fit py-3.5 bg-black text-white text-sm transition'>
          {buttonText}
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
