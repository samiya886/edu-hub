import React from 'react';

/**
 * Container component applying a max‑width and responsive horizontal padding.
 * Used to constrain page content on larger screens while keeping a tight
 * layout on mobile devices.
 */
const Container = ({ children }) => (
  <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
    {children}
  </div>
);

export default Container;
