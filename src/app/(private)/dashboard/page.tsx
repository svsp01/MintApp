'use client';
import React, { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import { DashboardData } from '@/types/dashboard';

const Page = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/dashboardData');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const result: DashboardData = await response.json();
        setData(result);
      } catch (error) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!data) return <div>No data available</div>;

  return (
    <div className='w-full bg-white flex justify-center items-center'>
      <Dashboard data={data} />
    </div>
  );
};

export default Page;
