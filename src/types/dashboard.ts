// src/types/dashboard.ts

export interface BudgetData {
    category: string;
    amount: number;
    color: string;
  }
  
  export interface TransactionHistory {
    date: string;
    category: string;
    amount: number;
  }
  
  export interface InvestmentData {
    month: string;
    amount: number;
  }
  
  export interface JobData {
    title: string;
    company: string;
    salary: string;
    location: string;
  }
  
  export interface DashboardData {
    monthlyIncome: number;
    savings: number;
    budgetData: BudgetData[];
    transactionHistory: TransactionHistory[];
    savingsGoal: number;
    currentSavings: number;
    investmentData: InvestmentData[];
    jobData: JobData[];
    aiChatHistory:any
  }
