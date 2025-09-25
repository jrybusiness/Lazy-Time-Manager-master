
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ children, fullWidth = false, ...props }) => {
  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      {...props}
      className={`
        ${widthClass}
        inline-flex items-center justify-center px-6 py-3
        border border-transparent text-base font-medium rounded-md shadow-sm
        text-white bg-indigo-600 hover:bg-indigo-700
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
        dark:focus:ring-offset-gray-800
        transition-transform transform hover:scale-105
        disabled:bg-gray-400 disabled:cursor-not-allowed
      `}
    >
      {children}
    </button>
  );
};

export default Button;
