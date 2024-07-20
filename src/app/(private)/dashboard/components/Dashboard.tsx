import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer,
  AreaChart, Area,
  LineChart, Line
} from 'recharts';

// Dummy data
const monthlyIncome = 5000;
const savings = 1500;
const budgetData = [
  { category: 'Housing', amount: 1500, color: '#FF6384' },
  { category: 'Food', amount: 800, color: '#36A2EB' },
  { category: 'Transportation', amount: 400, color: '#FFCE56' },
  { category: 'Utilities', amount: 300, color: '#4BC0C0' },
  { category: 'Entertainment', amount: 200, color: '#9966FF' },
  { category: 'Savings', amount: 1500, color: '#FF9F40' },
  { category: 'Others', amount: 300, color: '#C9CBCF' },
];

const transactionHistory = [
  { date: '2023-07-01', category: 'Food', amount: 50 },
  { date: '2023-07-02', category: 'Transportation', amount: 30 },
  { date: '2023-07-03', category: 'Entertainment', amount: 100 },
  // ... more transactions
];

const savingsGoal = 10000;
const currentSavings = 7500;

const investmentData = [
  { month: 'Jan', amount: 1000 },
  { month: 'Feb', amount: 1200 },
  { month: 'Mar', amount: 1100 },
  { month: 'Apr', amount: 1400 },
  { month: 'May', amount: 1300 },
  { month: 'Jun', amount: 1600 },
];

const jobData = [
  { title: 'Senior Software Engineer', company: 'TechGiant Inc.', salary: '$120k-$180k', location: 'San Francisco, CA' },
  { title: 'Data Scientist', company: 'AI Innovations', salary: '$100k-$150k', location: 'New York, NY' },
  { title: 'Product Manager', company: 'StartupX', salary: '$110k-$160k', location: 'Austin, TX' },
  { title: 'UX Designer', company: 'DesignPro', salary: '$90k-$130k', location: 'Seattle, WA' },
  { title: 'Financial Analyst', company: 'BigBank Corp', salary: '$80k-$120k', location: 'Chicago, IL' },
];

function Dashboard() {
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
              <p className="text-sm text-gray-200">Budget Utilization</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
          </CardContent>
        </Card>


        <Card className="col-span-2  row-span-2">
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

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Investment Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={investmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>AI Financial Assistant</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px] mb-4 p-4 border rounded">
              <p className="mb-2"><span className="font-bold">AI:</span> Based on your spending patterns, I recommend reducing your entertainment budget by 15% to increase your savings rate.</p>
              <p className="mb-2"><span className="font-bold">You:</span> How can I improve my investment strategy?</p>
              <p><span className="font-bold">AI:</span> Consider diversifying your portfolio with a mix of stocks, bonds, and ETFs. Given your risk tolerance, a 60/40 split between stocks and bonds could be suitable.</p>
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
                <div key={index} className="mb-4 p-2 border-b">
                  <h3 className="font-bold">{job.title}</h3>
                  <p>{job.company}</p>
                  <p>{job.salary} - {job.location}</p>
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