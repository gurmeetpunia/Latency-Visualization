'use client';

interface IconProps {
  className?: string;
}

/**
 * Provider Icons for AWS, GCP, and Azure
 */
export function AWSIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      <path d="M12 4L4 8v8l8 4 8-4V8L12 4zm0 2.236l5.764 2.882v5.764L12 17.764 6.236 14.882V9.118L12 6.236z"/>
    </svg>
  );
}

export function GCPIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      <path d="M8 8h8v8H8V8zm1 1v6h6V9H9z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  );
}

export function AzureIcon({ className = 'w-5 h-5' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
      <path d="M7 7l5 10 5-10H7zm1 1h8l-4 8-4-8z"/>
    </svg>
  );
}

