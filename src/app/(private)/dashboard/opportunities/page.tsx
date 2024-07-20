'use client'
import { useState, useEffect } from 'react';
import JobCards from './components/JobCards';
import BuildOpportunities from './components/BuildOpportunities';
import MultiSelect from '@/ui/reusableComponents/Multiselect';
import { motion } from 'framer-motion';

const options = [
  { label: 'JavaScript', value: 'javascript' },
  { label: 'React', value: 'react' },
  { label: 'Node.js', value: 'nodejs' },
];

const Opportunities = () => {
  const [selectedKeywords, setSelectedKeywords]:any = useState([]);
  const [jobCount, setJobCount] = useState(0);
  const [engagementRate, setEngagementRate] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-blue-600 text-white py-4 px-6 rounded-lg shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-4">Opportunities Dashboard</h1>
        <div className="flex justify-between items-center">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white bg-opacity-20 p-4 rounded-lg"
          >
            <p className="text-xl font-semibold">Total Jobs</p>
            <p className="text-lg font-bold">{jobCount}</p>
          </motion.div>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="bg-white bg-opacity-20 p-4 rounded-lg"
          >
            <p className="text-xl font-semibold">Engagement Rate</p>
            <p className="text-lg font-bold">{engagementRate}%</p>
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto p-6">

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <JobCards setJobCount={setJobCount} setEngagementRate={setEngagementRate} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <BuildOpportunities keywords={selectedKeywords} />
        </motion.div>
      </div>
    </div>
  );
};

export default Opportunities;