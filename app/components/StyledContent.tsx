"use client";

import React from 'react';

const StyledContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <style global jsx>{`
        .prose a {
          color: #ffffff; /* White color */
          text-decoration: underline;
        }
        .prose a:hover {
          color: #e2e8f0; /* Light gray on hover for better UX */
        }
      `}</style>
    </>
  );
};

export default StyledContent;