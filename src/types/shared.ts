export enum Priority {
  High = 'high',
  Medium = 'medium',
  Low = 'low',
  None = 'none',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  order: number;
}

export interface TaskList {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  createdAt: Date;
  order: number;
}

export interface AppSettings {
  themeColor: string;
}

export interface ThemeColor {
  name: string;
  value: string;
}

export interface CompletionStats {
  total: number;
  completed: number;
  percentage: number;
}

export const THEME_COLORS: ThemeColor[] = [
  { name: 'Purple', value: 'purple' },
  { name: 'Blue', value: 'blue' },
  { name: 'Green', value: 'green' },
  { name: 'Pink', value: 'pink' },
  { name: 'Indigo', value: 'indigo' },
  { name: 'Red', value: 'red' },
  { name: 'Orange', value: 'orange' },
  { name: 'Teal', value: 'teal' },
];

export const PRIORITY_CONFIG = {
  [Priority.High]: { color: 'bg-red-500', label: 'High Priority' },
  [Priority.Medium]: { color: 'bg-orange-500', label: 'Medium Priority' },
  [Priority.Low]: { color: 'bg-blue-500', label: 'Low Priority' },
  [Priority.None]: { color: 'bg-gray-300', label: 'No Priority' },
};