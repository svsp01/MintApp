'use client'
import { useRouter } from 'next/navigation';
import React from 'react'

function page() {
    const router = useRouter();
    const handleLogout = async() => {
        try {
            await fetch('/api/logout', {
              method: 'POST',
            });
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            router.push('/login');
          } catch (error) {
            console.error('Logout failed:', error);
          }
      };
  return (
    
    <div className=' w-full bg-slate-400 flex py-10 justify-center items-center'>
        <button className='bg-white p-2 cursor-pointer text-black' onClick={()=>handleLogout() }>Logout</button>
    </div>
  )
}

export default page