import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateUtilization(
  hoursWorked: number,
  dealDays: number
): number {
  if (dealDays === 0) return 0;
  return (hoursWorked / (dealDays * 8)) * 100;
}

export function getUtilizationColor(utilization: number): string {
  if (utilization > 100) return 'utilization-over';
  if (utilization >= 70) return 'utilization-high';
  if (utilization >= 40) return 'utilization-medium';
  return 'utilization-low';
}

export function getMonthName(monthNumber: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[monthNumber - 1] || '';
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export const APP_CONFIG = {
  name: 'ClientPlus',
  version: '1.0.0',
  description: 'Consultant tracking and client management system',
  defaultWorkingHours: 8,
  supportedFileTypes: ['xlsx', 'csv', 'pdf'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
} as const;


