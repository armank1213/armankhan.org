"use client";

import React from 'react';

const StyledContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      {children}
      <style global jsx>{`
        .prose a {
          color: #60a5fa; /* Bright blue color */
          text-decoration: underline;
        }
        .prose a:hover {
          color: #93c5fd; /* Lighter blue on hover */
        }
      `}</style>
    </>
  );
};

export default StyledContent;