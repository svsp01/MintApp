'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import handleLogout from '@/lib/authUtils';


const Page = () => {
  const router = useRouter();

  return (
    <div className='w-full bg-slate-400 flex py-10 justify-center items-center'>
      <button
        className='bg-white p-2 cursor-pointer text-black'
        onClick={() => handleLogout(router)}
      >
        Logout
      </button>
    </div>
  );
};

export default Page;
