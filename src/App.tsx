import React, { useState } from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import './App.css';
import ImageUpload, { ImageItem } from './components/ImageUpload';
import TierList, { Tier } from './components/TierList';

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

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="App">
        <header className="App-header">
          <h1>Tier List Maker</h1>
        </header>
        
        <main className="App-main">
          <ImageUpload 
            images={images} 
            onImagesChange={setImages} 
          />
          <TierList 
            tiers={tiers}
            onTiersChange={setTiers}
          />
        </main>
      </div>
    </DragDropContext>
  );
}

export default App;
