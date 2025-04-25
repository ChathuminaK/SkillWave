import React from 'react';

const StatsCard = ({ title, value, subtitle, type = 'primary' }) => {
  return (
    <div className={`card shadow-sm stats-card ${type}`}>
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
        <h2>{value}</h2>
        <p className="text-muted mb-0">{subtitle}</p>
      </div>
    </div>
  );
};

export default StatsCard;