'use client';
import Sidebar from '@/component/sidebar/Sidebar';
import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const Wrapper = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  // Retrieve sidebar state from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('isOpen');
      if (saved !== null) {
        setIsOpen(JSON.parse(saved));
      }
    }
  }, []);

  // Update localStorage when isOpen changes.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isOpen', JSON.stringify(isOpen));
    }
  }, [isOpen]);

  // Only check authentication if not on the login page.
  useEffect(() => {
    if (pathname !== '/login') {
      const isAuthenticated = localStorage.getItem('adminToken');
      if (!isAuthenticated) {
        router.push('/login');
      }
    }
  }, [router, pathname]);

  // If on the login page, render children without the sidebar.
  if (pathname === '/login') {
    return <>{children}</>;
  }

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`md:px-8 px-4 transition-width duration-300 ${
          isOpen ? 'ml-56' : 'ml-20'
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
