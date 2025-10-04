import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import './App.css';
import ImageUpload, { ImageItem } from './components/ImageUpload';
import TierList, { Tier } from './components/TierList';
import ImageModal from './components/ImageModal';
import TextInput from './components/TextInput';
import { textToImage } from './utils/textToImage';

function App() {
  const [images, setImages] = useState<ImageItem[]>([]);
  
  // Initialize tiers with empty image arrays
  const [tiers, setTiers] = useState<Tier[]>([
    { id: 'tier-s', label: 'S', color: '#ff7f7f', images: [] },
    { id: 'tier-a', label: 'A', color: '#ffbf7f', images: [] },
    { id: 'tier-b', label: 'B', color: '#ffdf7f', images: [] },
    { id: 'tier-c', label: 'C', color: '#ffff7f', images: [] },
    { id: 'tier-d', label: 'D', color: '#bfff7f', images: [] },
  ]);

  // Modal state
  const [modalImage, setModalImage] = useState<ImageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If no destination, do nothing
    if (!destination) {
      return;
    }

    // If dropped in the same position, do nothing
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Handle reordering within the same tier
    if (source.droppableId === destination.droppableId && source.droppableId !== 'image-pool') {
      setTiers(prev => prev.map(tier => {
        if (tier.id === source.droppableId) {
          const reorderedImages = Array.from(tier.images);
          const [removed] = reorderedImages.splice(source.index, 1);
          reorderedImages.splice(destination.index, 0, removed);
          return { ...tier, images: reorderedImages };
        }
        return tier;
      }));
      return;
    }

    // Handle reordering within image pool
    if (source.droppableId === 'image-pool' && destination.droppableId === 'image-pool') {
      setImages(prev => {
        const reorderedImages = Array.from(prev);
        const [removed] = reorderedImages.splice(source.index, 1);
        reorderedImages.splice(destination.index, 0, removed);
        return reorderedImages;
      });
      return;
    }

    // Handle moving between different containers (existing logic)
    // Find the dragged image
    let draggedImage: ImageItem | null = null;

    // Check if dragging from image pool
    if (source.droppableId === 'image-pool') {
      draggedImage = images.find(img => img.id === draggableId) || null;
    } else {
      // Dragging from a tier
      const sourceTier = tiers.find(tier => tier.id === source.droppableId);
      if (sourceTier) {
        draggedImage = sourceTier.images.find((img: ImageItem) => img.id === draggableId) || null;
      }
    }

    if (!draggedImage) return;

    // Remove image from source
    if (source.droppableId === 'image-pool') {
      setImages(prev => prev.filter(img => img.id !== draggableId));
    } else {
      setTiers(prev => prev.map(tier => 
        tier.id === source.droppableId
          ? { ...tier, images: tier.images.filter((img: ImageItem) => img.id !== draggableId) }
          : tier
      ));
    }

    // Add image to destination
    if (destination.droppableId === 'image-pool') {
      setImages(prev => {
        const newImages = [...prev];
        newImages.splice(destination.index, 0, draggedImage!);
        return newImages;
      });
    } else {
      setTiers(prev => prev.map(tier => 
        tier.id === destination.droppableId
          ? { 
              ...tier, 
              images: (() => {
                const newImages = [...tier.images];
                newImages.splice(destination.index, 0, draggedImage!);
                return newImages;
              })()
            }
          : tier
      ));
    }
  };

  // Modal handlers
  const handleImageClick = (image: ImageItem) => {
    setModalImage(image);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalImage(null);
  };

  const handleDescriptionChange = (description: string) => {
    if (!modalImage) return;

    const updatedImage = { ...modalImage, description };
    setModalImage(updatedImage);

    // Update the image in the state (either in images array or in tiers)
    setImages(prev => prev.map(img => 
      img.id === modalImage.id ? updatedImage : img
    ));

    setTiers(prev => prev.map(tier => ({
      ...tier,
      images: tier.images.map((img: ImageItem) => 
        img.id === modalImage.id ? updatedImage : img
      )
    })));
  };

  // Handler for adding text items
  const handleTextItemAdd = (textItem: ImageItem) => {
    setImages(prev => [...prev, textItem]);
  };

  // Handler for updating text items
  const handleTextUpdate = (text: string, options: { fontSize: number; backgroundColor: string; textColor: string }) => {
    if (!modalImage || modalImage.type !== 'text') return;

    // Generate new image from updated text
    const newImageDataUrl = textToImage({
      text,
      fontSize: options.fontSize,
      backgroundColor: options.backgroundColor,
      textColor: options.textColor,
      width: 150,
      height: 150,
    });

    const updatedImage: ImageItem = {
      ...modalImage,
      src: newImageDataUrl,
      name: text.substring(0, 30) + (text.length > 30 ? '...' : ''),
      textContent: text,
      textOptions: options,
    };

    setModalImage(updatedImage);

    // Update the image in the state (either in images array or in tiers)
    setImages(prev => prev.map(img => 
      img.id === modalImage.id ? updatedImage : img
    ));

    setTiers(prev => prev.map(tier => ({
      ...tier,
      images: tier.images.map((img: ImageItem) => 
        img.id === modalImage.id ? updatedImage : img
      )
    })));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="App">
        <header className="App-header">
          <h1>Tier List Maker</h1>
        </header>
        
        <main className="App-main">
          <TextInput onTextItemAdd={handleTextItemAdd} />
          <ImageUpload 
            images={images} 
            onImagesChange={setImages}
            onImageClick={handleImageClick}
          />
          <TierList 
            tiers={tiers}
            onTiersChange={setTiers}
            onImageClick={handleImageClick}
          />
        </main>
        
        {modalImage && (
          <ImageModal
            isOpen={isModalOpen}
            imageUrl={modalImage.src}
            imageName={modalImage.name}
            description={modalImage.description}
            onClose={handleModalClose}
            onDescriptionChange={handleDescriptionChange}
            itemType={modalImage.type}
            textContent={modalImage.textContent}
            textOptions={modalImage.textOptions}
            onTextUpdate={handleTextUpdate}
          />
        )}
      </div>
    </DragDropContext>
  );
}

export default App;
