import React from 'react';
import './ImageUpload.css';

const ImageUpload: React.FC = () => {
  return (
    <div className="image-upload-section">
      <h2>Upload Images</h2>
      <div className="upload-area">
        <input
          type="file"
          accept="image/*"
          multiple
          className="file-input"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="upload-button">
          Choose Images
        </label>
      </div>
      
      <div className="image-pool">
        <h3>Image Pool</h3>
        <div className="image-pool-container">
          {/* Images will be displayed here */}
          <p className="placeholder-text">No images uploaded yet</p>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;