import React from 'react';

const SkeletonLoader: React.FC = () => {
  return (
    <div className="animate-pulse flex flex-col space-y-4 p-6">
      <div className="bg-blue-400 h-24 rounded-lg"></div>
      <div className="bg-gray-200 h-60 rounded-lg"></div>
      <div className="bg-gray-200 h-16 rounded-lg"></div>
      <div className="bg-gray-200 h-40 rounded-lg"></div>
      <div className="bg-gray-200 h-40 rounded-lg"></div>
    </div>
  );
};

export default SkeletonLoader;
