'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import handleLogout from '@/lib/authUtils';
import Dashboard from './components/Dashboard';


const Page = () => {
  const router = useRouter();

  return (
    <div className='w-full bg-white flex  justify-center items-center'>
      <Dashboard/>
    </div>
  );
};

export default Page;
