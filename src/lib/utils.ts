import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getMonthDays(year: number, month: number): Date[] {
  const days = [];
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  for (let d = new Date(firstDay); d <= lastDay; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }

  return days;
}
export function getFormatedDate(date: any): string {
  let firstDay = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();
  console.log(month, "firstDay")

  if (firstDay < 9) {
    firstDay = `0${firstDay}`;
  }
  if (month < 9) {
    month = `0${month}`;
  }

  return `${year}-${month}-${firstDay}`;
}

