import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './ImageUpload.css';

export interface ImageItem {
  id: string;
  src: string;
  name: string;
  description?: string;
}

interface ImageUploadProps {
  images: ImageItem[];
  onImagesChange: (images: ImageItem[]) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ images, onImagesChange }) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const validFiles = Array.from(files).filter(file => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        alert(`File ${file.name} is not a valid image.`);
        return false;
      }
      
      return true;
    });

    const newImages: ImageItem[] = validFiles.map((file, index) => ({
      id: `img-${Date.now()}-${index}`,
      src: URL.createObjectURL(file),
      name: file.name,
      description: ''
    }));

    onImagesChange([...images, ...newImages]);
    
    // Reset input value to allow uploading the same files again
    event.target.value = '';
  };

  const removeImage = (imageId: string) => {
    // Find the image to remove and cleanup its object URL
    const imageToRemove = images.find(img => img.id === imageId);
    if (imageToRemove && imageToRemove.src.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.src);
    }
    
    const updatedImages = images.filter(img => img.id !== imageId);
    onImagesChange(updatedImages);
  };

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
          onChange={handleFileChange}
        />
        <label htmlFor="image-upload" className="upload-button">
          Choose Images
        </label>
      </div>
      
      <div className="image-pool">
        <h3>Image Pool ({images.length} images)</h3>
        <Droppable droppableId="image-pool" direction="horizontal">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={`image-pool-container ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
            >
              {images.length === 0 ? (
                <p className="placeholder-text">No images uploaded yet</p>
              ) : (
                images.map((image, index) => (
                  <Draggable key={image.id} draggableId={image.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`image-thumbnail ${snapshot.isDragging ? 'dragging' : ''}`}
                        style={{
                          ...provided.draggableProps.style,
                        }}
                      >
                        <img src={image.src} alt={image.name} draggable={false} />
                        <button 
                          className="remove-image-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeImage(image.id);
                          }}
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </div>
    </div>
  );
};

export default ImageUpload;