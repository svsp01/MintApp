// File: `/app/utils/regexPatterns.ts`

interface RegexPattern {
    pattern: RegExp;
    query: string;
    capture?: boolean;
  }
  
  export const regexPatterns: RegexPattern[] = [
    // Transactions Queries
    {
      pattern: /total transactions\?/i,
      query: 'total_transactions'
    },
    {
      pattern: /recent transactions\?/i,
      query: 'recent_transactions'
    },
    {
      pattern: /transactions for the last (\d+) days/i,
      query: 'transactions_last_days',
      capture: true
    },
    {
      pattern: /details of transaction (\w+)/i,
      query: 'transaction_details',
      capture: true
    },
    {
      pattern: /total amount spent/i,
      query: 'total_amount_spent'
    },
    {
      pattern: /average transaction amount/i,
      query: 'average_transaction_amount'
    },
  
    // Expenses Queries
    {
      pattern: /total expenses\?/i,
      query: 'total_expenses'
    },
    {
      pattern: /expenses for the last (\d+) days/i,
      query: 'expenses_last_days',
      capture: true
    },
    {
      pattern: /details of expense (\w+)/i,
      query: 'expense_details',
      capture: true
    },
    {
      pattern: /expenses by category (\w+)/i,
      query: 'expenses_by_category',
      capture: true
    },
    {
      pattern: /total food expenses\?/i,
      query: 'total_food_expenses'
    },
  
    // Income Queries
    {
      pattern: /total income\?/i,
      query: 'total_income'
    },
    {
      pattern: /income for the last (\d+) days/i,
      query: 'income_last_days',
      capture: true
    },
    {
      pattern: /details of income (\w+)/i,
      query: 'income_details',
      capture: true
    },
  
    // Budget Queries
    {
      pattern: /total budget\?/i,
      query: 'total_budget'
    },
    {
      pattern: /budget for the last (\d+) days/i,
      query: 'budget_last_days',
      capture: true
    },
    {
      pattern: /remaining budget\?/i,
      query: 'remaining_budget'
    },
  
    // General Queries
    {
      pattern: /show all transactions/i,
      query: 'show_all_transactions'
    },
    {
      pattern: /show all expenses/i,
      query: 'show_all_expenses'
    },
    {
      pattern: /show all income/i,
      query: 'show_all_income'
    },
    {
      pattern: /list all categories/i,
      query: 'list_all_categories'
    },
    {
      pattern: /list all users/i,
      query: 'list_all_users'
    },
  
    // Custom User Queries
    {
      pattern: /total (\w+) (\w+)/i,
      query: 'custom_total',
      capture: true
    },
    {
      pattern: /(\w+) transactions/i,
      query: 'custom_transactions',
      capture: true
    },
    {
      pattern: /(\w+) expenses/i,
      query: 'custom_expenses',
      capture: true
    },
    {
      pattern: /(\w+) income/i,
      query: 'custom_income',
      capture: true
    }
  ];
  