import React from 'react';

const PageHeader = ({ title, subtitle, actionButton }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h2 className="mb-1">{title}</h2>
        {subtitle && <p className="text-muted">{subtitle}</p>}
        <div className="section-divider"></div>
      </div>
      {actionButton && actionButton}
    </div>
  );
};

export default PageHeader;