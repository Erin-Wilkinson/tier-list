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

const TierList: React.FC<TierListProps> = ({ tiers, onTiersChange }) => {
  const [editingTier, setEditingTier] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');

  const startEditing = (tierId: string, currentLabel: string) => {
    setEditingTier(tierId);
    setEditValue(currentLabel);
  };

  const saveEdit = (tierId: string) => {
    if (editValue.trim()) {
      onTiersChange(tiers.map(tier => 
        tier.id === tierId ? { ...tier, label: editValue.trim() } : tier
      ));
    }
    setEditingTier(null);
    setEditValue('');
  };

  const cancelEdit = () => {
    setEditingTier(null);
    setEditValue('');
  };

  const addTier = () => {
    const newTier: Tier = {
      id: `tier-${Date.now()}`,
      label: 'New Tier',
      color: '#cccccc',
      images: []
    };
    onTiersChange([...tiers, newTier]);
  };

  const deleteTier = (tierId: string) => {
    if (window.confirm('Are you sure you want to delete this tier? All images in it will be lost.')) {
      onTiersChange(tiers.filter(tier => tier.id !== tierId));
    }
  };

  const generateRandomColor = () => {
    const colors = ['#ff7f7f', '#ffbf7f', '#ffdf7f', '#ffff7f', '#bfff7f', '#7fff7f', '#7fffbf', '#7fffdf', '#7fffff', '#7fbfff', '#7f7fff', '#bf7fff', '#df7fff', '#ff7fff', '#ff7fbf'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const changeColor = (tierId: string) => {
    const newColor = generateRandomColor();
    onTiersChange(tiers.map(tier => 
      tier.id === tierId ? { ...tier, color: newColor } : tier
    ));
  };

  return (
    <div className="tier-list-section">
      <div className="tier-list-header">
        <h2>Tier List</h2>
        <button className="add-tier-btn" onClick={addTier}>
          + Add Tier
        </button>
      </div>
      <div className="tier-list-container">
        {tiers.map((tier) => (
          <div key={tier.id} className="tier-row">
            <div className="tier-label-container">
              <div 
                className="tier-label" 
                style={{ backgroundColor: tier.color }}
                onClick={() => changeColor(tier.id)}
                title="Click to change color"
              >
                {editingTier === tier.id ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(tier.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit(tier.id);
                      if (e.key === 'Escape') cancelEdit();
                    }}
                    className="tier-edit-input"
                    autoFocus
                  />
                ) : (
                  <span
                    onDoubleClick={() => startEditing(tier.id, tier.label)}
                    title="Double-click to edit"
                  >
                    {tier.label}
                  </span>
                )}
              </div>
              <div className="tier-controls">
                <button
                  className="tier-control-btn edit-btn"
                  onClick={() => startEditing(tier.id, tier.label)}
                  title="Edit tier name"
                >
                  ✏️
                </button>
                <button
                  className="tier-control-btn delete-btn"
                  onClick={() => deleteTier(tier.id)}
                  title="Delete tier"
                  disabled={tiers.length <= 1}
                >
                  🗑️
                </button>
              </div>
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