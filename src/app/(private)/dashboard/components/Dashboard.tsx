import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip,
  LineChart, Line, ResponsiveContainer
} from 'recharts';
import { DashboardData } from '@/types/dashboard';

interface DashboardProps {
  data: DashboardData;
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const {
    monthlyIncome,
    savings,
    transactionHistory,
    savingsGoal,
    currentSavings,
    jobData,
    aiChatHistory
  } = data;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="px-6 bg-white min-h-screen"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Financial Overview */}
        <Card className="col-span-full bg-blue-600 text-white">
          <CardHeader>
            <CardTitle>Financial Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <div>
              <p className="text-sm text-gray-200">Monthly Income</p>
              <p className="text-2xl font-bold">${monthlyIncome}</p>
            </div>
            <div>
              <p className="text-sm text-gray-200">Savings</p>
              <p className="text-2xl font-bold">${savings}</p>
            </div>
            <div>
              <p className="text-sm text-gray-200">Current Savings</p>
              <p className="text-2xl font-bold">${currentSavings}</p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={transactionHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="amount" stroke="#2563EB" fill="#2563EB" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Savings Goal */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    {Math.round((currentSavings / savingsGoal) * 100)}%
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    ${currentSavings} / ${savingsGoal}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${(currentSavings / savingsGoal) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Financial Assistant */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>AI Financial Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4 p-4 border rounded">
              {aiChatHistory.map((chat:any, index:any) => (
                <p key={index} className="mb-2">
                  <span className="font-bold">{chat.user}:</span> {chat.message}
                </p>
              ))}
            </ScrollArea>
            <div className="flex">
              <Input placeholder="Ask a financial question..." className="flex-grow mr-2" />
              <Button>Send</Button>
            </div>
          </CardContent>
        </Card>

        {/* Job Opportunities */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Job Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              {jobData.map((job, index) => (
                <div key={index} className="mb-4">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-gray-600">{job.salary}</p>
                  <p className="text-gray-600">{job.location}</p>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

export default Dashboard;
