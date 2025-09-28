import React from 'react';
import './ImageModal.css';

export interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
  onDescriptionChange: (description: string) => void;
  description: string;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageName,
  onClose,
  onDescriptionChange,
  description
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
        
        <div className="modal-image-container">
          <img 
            src={imageUrl} 
            alt={imageName}
            className="modal-image"
          />
        </div>
        
        <div className="modal-info">
          <div className="description-section">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              placeholder="Add a description for this image..."
              className="description-input"
              rows={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;