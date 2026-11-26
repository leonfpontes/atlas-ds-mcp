import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** shadcn/ui's class helper: joins conditional classes, and the last Tailwind class of a kind wins. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
