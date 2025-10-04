import React, { useState } from 'react';
import { textToImage } from '../utils/textToImage';
import { ImageItem } from './ImageUpload';
import './TextInput.css';

interface TextInputProps {
  onTextItemAdd: (item: ImageItem) => void;
}

const TextInput: React.FC<TextInputProps> = ({ onTextItemAdd }) => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(24);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  const handleAddText = () => {
    if (!text.trim()) {
      alert('Please enter some text');
      return;
    }

    // Generate image from text
    const imageDataUrl = textToImage({
      text: text.trim(),
      fontSize,
      backgroundColor,
      textColor,
      width: 150,
      height: 150,
    });

    // Create new ImageItem
    const newTextItem: ImageItem = {
      id: `text-${Date.now()}`,
      src: imageDataUrl,
      name: text.trim().substring(0, 30) + (text.length > 30 ? '...' : ''),
      description: text.trim(),
      type: 'text',
      textContent: text.trim(),
      textOptions: {
        fontSize,
        backgroundColor,
        textColor,
      },
    };

    onTextItemAdd(newTextItem);
    
    // Reset form
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddText();
    }
  };

  return (
    <div className="text-input-section">
      <h2>Add Custom Text</h2>
      
      <div className="text-input-container">
        <div className="text-input-row">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter your text here..."
            className="text-input-field"
            maxLength={100}
          />
          <button onClick={handleAddText} className="add-text-button">
            Add Text
          </button>
        </div>

        <div className="text-options">
          <div className="option-group">
            <label htmlFor="font-size">Font Size:</label>
            <input
              id="font-size"
              type="range"
              min="16"
              max="48"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="slider"
            />
            <span className="option-value">{fontSize}px</span>
          </div>

          <div className="option-group">
            <label htmlFor="bg-color">Background:</label>
            <input
              id="bg-color"
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="color-picker"
            />
          </div>

          <div className="option-group">
            <label htmlFor="text-color">Text Color:</label>
            <input
              id="text-color"
              type="color"
              value={textColor}
              onChange={(e) => setTextColor(e.target.value)}
              className="color-picker"
            />
          </div>
        </div>

        <div className="preview-section">
          <span className="preview-label">Preview:</span>
          <div 
            className="text-preview"
            style={{
              backgroundColor,
              color: textColor,
              fontSize: `${fontSize * 0.6}px`,
              fontFamily: "'Crimson Text', serif",
            }}
          >
            {text || 'Your text will appear here'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextInput;
