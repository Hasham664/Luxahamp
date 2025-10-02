import React from 'react'
import Hero from './HeroSlider'
import CategoriesSlider from './CategoriesSlider'
import OurPromise from './OurPromise'
import ProductApiCall from './ProductApiCall'
import GiftHappiness from './GiftHappiness'
import ReusableCard from './ReusableCard'
import valatine from '../../../public/images/valantine.png';
import ownHamper from '../../../public/images/ownHamper.png';
import TestimonialsSlider from './TestimonialsSlider'
const HomeAllComponents = () => {
  const card1 = {
    title: 'Valentine Day',
    listItems: ['Birthday', 'Anniversary', 'Surprise Box'],
    des: "Embrace romance with our Valentine's Day collection. Find the perfect gift to captivate hearts.",
    image: valatine,
    bgColor: '#FFDFEE',
    buttonText: 'Shop Collection',
  };

  const card2 = {
    miniTitle: 'BUNDLE & SAVE',
    title: 'Build Your Own Hamper From ₹799',
    listItems: [
      'Select your products',
      'Choose packaging',
      'Add a personal note',
      'Delivered at your doorstep',
    ],

    image: ownHamper,
    bgColor: '#F9F4E9',
    buttonText: 'MAKE YOUR OWN HAMPER',
    reverse: true,
  };
  return (
    <div>
        <Hero />
        <CategoriesSlider />
        <OurPromise/>
        <ProductApiCall/>
        <GiftHappiness/>
         <div className="">
      <ReusableCard {...card1} />
      <ReusableCard {...card2} />
      <TestimonialsSlider />
    </div>
    </div>
  )
}

export default HomeAllComponents