import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-inner mt-8">
      <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p>持之以恆，每天進步一點點。</p>
        <p>&copy; {new Date().getFullYear()} Daily Task Tracker. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
