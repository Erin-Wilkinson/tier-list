import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import './TierList.css';
import { ImageItem } from './ImageUpload';

export interface Tier {
  id: string;
  label: string;
  color: string;
  images: ImageItem[];
}

interface TierListProps {
  tiers: Tier[];
  onTiersChange: (tiers: Tier[]) => void;
}

const TierList: React.FC<TierListProps> = ({ tiers }) => {
  return (
    <div className="tier-list-section">
      <h2>Tier List</h2>
      <div className="tier-list-container">
        {tiers.map((tier) => (
          <div key={tier.id} className="tier-row">
            <div 
              className="tier-label" 
              style={{ backgroundColor: tier.color }}
            >
              {tier.label}
            </div>
            <Droppable droppableId={tier.id} direction="horizontal">
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`tier-content ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {tier.images.length === 0 ? (
                    <div className="tier-placeholder">
                      Drop images here
                    </div>
                  ) : (
                    tier.images.map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`tier-image ${snapshot.isDragging ? 'dragging' : ''}`}
                            style={{
                              ...provided.draggableProps.style,
                            }}
                          >
                            <img src={image.src} alt={image.name} draggable={false} />
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
        ))}
      </div>
    </div>
  );
};

export default TierList;