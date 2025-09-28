import React from 'react';
import './TierList.css';

const TierList: React.FC = () => {
  return (
    <div className="tier-list-section">
      <h2>Tier List</h2>
      <div className="tier-list-container">
        {/* Tier rows will be rendered here */}
        <p className="placeholder-text">Tier rows will appear here</p>
      </div>
    </div>
  );
};

export default TierList;