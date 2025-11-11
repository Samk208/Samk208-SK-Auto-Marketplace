
import React, { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
  onDismiss: () => void;
}

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>
);

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>
);

const InfoIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
);


export const Toast: React.FC<ToastProps> = ({ message, type = 'success', onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Use a ref to track if component is mounted
    let isMounted = true;
    
    // Set visible after mount
    const showTimer = setTimeout(() => {
      if (isMounted) setVisible(true);
    }, 0);
    
    const hideTimer = setTimeout(() => {
      if (isMounted) setVisible(false);
      setTimeout(() => {
        if (isMounted) onDismiss();
      }, 300); // Wait for fade out animation
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [message, onDismiss]);

  const typeStyles = {
    success: 'bg-green-50 dark:bg-green-900/50 border-green-200 dark:border-green-700 text-green-800 dark:text-green-200',
    error: 'bg-red-50 dark:bg-red-900/50 border-red-200 dark:border-red-700 text-red-800 dark:text-red-200',
    info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-700 text-blue-800 dark:text-blue-200',
  };

  const Icon = {
      success: <CheckCircleIcon className="h-5 w-5" />,
      error: <XCircleIcon className="h-5 w-5" />,
      info: <InfoIcon className="h-5 w-5" />,
  }[type];

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 w-full max-w-sm p-4 border rounded-lg shadow-lg flex items-center gap-3 transition-transform duration-300 ease-in-out ${typeStyles[type]} ${visible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
      role="alert"
    >
        {Icon}
        <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
