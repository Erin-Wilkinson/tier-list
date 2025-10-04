import React, { useState } from 'react';
import './ImageModal.css';

export interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  imageName: string;
  onClose: () => void;
  onDescriptionChange: (description: string) => void;
  description: string;
  itemType?: 'image' | 'text';
  textContent?: string;
  textOptions?: {
    fontSize: number;
    backgroundColor: string;
    textColor: string;
  };
  onTextUpdate?: (text: string, options: { fontSize: number; backgroundColor: string; textColor: string }) => void;
}

const ImageModal: React.FC<ImageModalProps> = ({
  isOpen,
  imageUrl,
  imageName,
  onClose,
  onDescriptionChange,
  description,
  itemType = 'image',
  textContent = '',
  textOptions = { fontSize: 24, backgroundColor: '#ffffff', textColor: '#000000' },
  onTextUpdate
}) => {
  const [editedText, setEditedText] = useState(textContent);
  const [fontSize, setFontSize] = useState(textOptions.fontSize);
  const [backgroundColor, setBackgroundColor] = useState(textOptions.backgroundColor);
  const [textColor, setTextColor] = useState(textOptions.textColor);
  
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

  const handleUpdateText = () => {
    if (onTextUpdate && editedText.trim()) {
      onTextUpdate(editedText.trim(), { fontSize, backgroundColor, textColor });
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
          {itemType === 'text' && (
            <div className="text-edit-section">
              <h3>Edit Text</h3>
              <div className="edit-field">
                <label htmlFor="edit-text">Text:</label>
                <input
                  id="edit-text"
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="text-edit-input"
                />
              </div>
              
              <div className="edit-options">
                <div className="edit-option">
                  <label htmlFor="edit-font-size">Font Size:</label>
                  <input
                    id="edit-font-size"
                    type="range"
                    min="16"
                    max="48"
                    value={fontSize}
                    onChange={(e) => setFontSize(Number(e.target.value))}
                    className="slider"
                  />
                  <span>{fontSize}px</span>
                </div>
                
                <div className="edit-option">
                  <label htmlFor="edit-bg-color">Background:</label>
                  <input
                    id="edit-bg-color"
                    type="color"
                    value={backgroundColor}
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="color-picker"
                  />
                </div>
                
                <div className="edit-option">
                  <label htmlFor="edit-text-color">Text Color:</label>
                  <input
                    id="edit-text-color"
                    type="color"
                    value={textColor}
                    onChange={(e) => setTextColor(e.target.value)}
                    className="color-picker"
                  />
                </div>
              </div>
              
              <button onClick={handleUpdateText} className="update-text-btn">
                Update Text
              </button>
            </div>
          )}
          
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