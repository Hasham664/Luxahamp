'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, HeartIcon, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import MegaMenu from './MegaMenu';
import Image from 'next/image';
// import logo from '@/public/images/logo1.png';
import logo from '../../../public/images/logo1.png';
import { useCategories } from './CategoryHook';


export default function Navbar() {
  const { categories } = useCategories();
  const [openMenu, setOpenMenu] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);

  const grouped =
    categories && categories.length > 0
      ? categories.reduce((acc, cat) => {
          if (!acc[cat.mainTitle]) acc[cat.mainTitle] = [];
          acc[cat.mainTitle].push(cat);
          return acc;
        }, {})
      : {};

  return (
    <div className='relative z-50'>
      <nav className='w-full bg-white shadow-sm absolute top-0'>
        <div className='Mycontainer'>
          <div className='flex items-center justify-between h-20'>
            {/* Logo */}
            <Link href='/' className='flex items-center'>
              <Image
                src={logo}
                alt='Logo'
                width={140}
                height={140}
                className='mr-2 md:w-30 md:h-14 max-md:w-24 max-md:h-12'
              />
            </Link>

            {/* Desktop Navigation */}
            <div className='hidden  lg:flex items-center space-x-8'>
              <Link
                href='/'
                className='text-sm font-medium text-black hover:text-[#002073] transition-colors'
              >
                HOME
              </Link>

              <div className='relative group'>
                <button className='text-sm font-medium text-black hover:text-[#002073] transition-colors flex items-center gap-1'>
                  SHOP
                  <ChevronDown className='w-4 h-4' />
                </button>
                <MegaMenu grouped={grouped} mobile={false} />
              </div>

              <Link
                href='/corporate-gifting'
                className='text-sm font-medium text-black hover:text-[#002073] transition-colors'
              >
                CORPORATE GIFTING
              </Link>

              <Link
                href='/gift-of-the-month'
                className='text-sm font-medium text-black hover:text-[#002073] transition-colors'
              >
                GIFT OF THE MONTH
              </Link>
            </div>

            {/* Right Side - Desktop Icons + Mobile Icons */}
            <div className='flex items-center space-x-4 lg:space-x-6'>
              {/* Desktop Only Button */}
              <button className='hidden lg:block bg-[#D50061] cursor-pointer hover:bg-pink-700 text-white text-xs font-semibold px-6 py-2.5  transition-colors'>
                MAKE YOUR OWN
              </button>

              {/* Icons visible on both mobile and desktop */}
              <button className='text-black hover:text-[#002073]'>
                <Search size={20} />
              </button>

              <button className='text-black hover:text-[#002073]'>
                <User size={20} />
              </button>
              <button className='text-black hover:text-[#002073] relative'>
                <HeartIcon size={20} />
              </button>
              <button className='text-black hover:text-[#002073] relative'>
                <ShoppingCart size={20} />
              </button>

              {/* Mobile Menu Button - separated from icons */}
              <div className='lg:hidden w-px h-6 bg-gray-300'></div>
              <button
                className='lg:hidden text-black hover:text-[#002073]'
                onClick={() => setOpenMenu(!openMenu)}
              >
                {openMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {openMenu && (
          <div className='lg:hidden bg-white border-t border-gray-200'>
            <div className='container mx-auto px-4 py-6 max-h-[80vh] overflow-y-auto'>
              <div className='space-y-4 mb-6'>
                <a
                  href='/'
                  className='block text-sm font-medium text-black hover:text-pink-600 py-2'
                >
                  HOME
                </a>

                {/* Mobile Shop with dropdown */}
                <div>
                  <button
                    onClick={() => setShowMegaMenu(!showMegaMenu)}
                    className='w-full flex items-center justify-between text-sm font-medium text-black hover:text-pink-600 py-2'
                  >
                    <span>SHOP</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        showMegaMenu ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {showMegaMenu && (
                    <div className='mt-3'>
                      <MegaMenu grouped={grouped} mobile={true} />
                    </div>
                  )}
                </div>

                <a
                  href='/corporate-gifting'
                  className='block text-sm font-medium text-black hover:text-pink-600 py-2'
                >
                  CORPORATE GIFTING
                </a>
                <a
                  href='/gift-of-the-month'
                  className='block text-sm font-medium text-black hover:text-pink-600 py-2'
                >
                  GIFT OF THE MONTH
                </a>
              </div>

              <div className='mt-6 pt-6 border-t border-gray-200'>
                <button className='w-full bg-[#D50061] cursor-pointer hover:bg-pink-700 text-white text-sm font-semibold px-6 py-3 transition-colors'>
                  MAKE YOUR OWN
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}
