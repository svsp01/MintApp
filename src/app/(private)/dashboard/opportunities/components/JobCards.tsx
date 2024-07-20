'use client'
import { useDynamicToast } from '@/lib/toastUtils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { BuildingOffice2Icon, MapPinIcon, ClockIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import jobsService from '@/service/jobsService';

interface Job {
  _id: string;
  company: string;
  keywords: string;
  title: string;
  location: string;
  postedAt: string;
  url: string;
}

interface JobCardsProps {
    setJobCount: any
    setEngagementRate:any
}

const JobCards: React.FC<JobCardsProps> = ({setJobCount, setEngagementRate}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { showToast } = useDynamicToast();

  const loadJobs = async () => {
      setLoading(true);
      try {
        const result = await jobsService.fetchJobs()
        if (result?.success) {
          setJobs(result?.data?.data);
          setJobCount(result?.data?.data?.length)
    
          const engagementRate = jobs.length > 0
            ? 40 / jobs.length 
            : 0;
    
          setEngagementRate(engagementRate); 
    
        } else {
          showToast('Error', `Something went wrong`, 'destructive');
        }
      } catch (error) {
        showToast('Error', 'Something went wrong', 'destructive');
      } finally {
        setLoading(false);
      }
    
  };

  useEffect(() => {
    loadJobs();
  }, []);

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Listings</h2>
      {jobs.length === 0 && !loading && (
        <h2 className="text-sm text-center font-bold mb-6 text-gray-800">No Jobs Available</h2>
      )}
      {loading ? (
        <motion.div
          className="flex justify-center items-center h-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {jobs?.map((job, index) => (
            <motion.div
              key={job._id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-blue-600">{job.title}</h3>
                <span className="text-xs font-semibold bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {job.keywords}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <BuildingOffice2Icon className="w-5 h-5 mr-2" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPinIcon className="w-5 h-5 mr-2" />
                  <span>{job.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <ClockIcon className="w-5 h-5 mr-2" />
                  <span>Posted on {new Date(job.postedAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-300"
                >
                  Apply Now
                  <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-2" />
                </a>
                <span className="text-xs text-gray-500">ID: {job._id.slice(-6)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default JobCards;