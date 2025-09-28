import React, { useState } from 'react';
import './ImageTooltip.css';

export interface ImageTooltipProps {
  children: React.ReactNode;
  description: string;
  imageName: string;
}

const ImageTooltip: React.FC<ImageTooltipProps> = ({ children, description, imageName }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    });
  };

  // Only show tooltip if there's a description
  const showTooltip = description && description.trim().length > 0;

  return (
    <div
      className="tooltip-wrapper"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
      {showTooltip && isVisible && (
        <div
          className="image-tooltip"
          style={{
            left: position.x,
            top: position.y
          }}
        >
          <div className="tooltip-content">
            <div className="tooltip-description">{description}</div>
          </div>
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};

export default ImageTooltip;