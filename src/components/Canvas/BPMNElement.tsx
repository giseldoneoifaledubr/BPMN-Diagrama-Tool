import React from 'react';
import { Circle, Square, Diamond, CircleDot } from 'lucide-react';
import { BPMNElement as BPMNElementType } from '../../types/bpmn';
import { ConnectionHandle } from './ConnectionHandle';

interface BPMNElementProps {
  element: BPMNElementType;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onDelete: (id: string) => void;
  onConnectionStart: (elementId: string, position: { x: number; y: number }) => void;
  onConnectionEnd: (elementId: string) => void;
  onUpdateLabel: (id: string, label: string) => void;
  isConnecting: boolean;
}

export const BPMNElement: React.FC<BPMNElementProps> = ({
  element,
  isSelected,
  onSelect,
  onMove,
  onDelete,
  onConnectionStart,
  onConnectionEnd,
  onUpdateLabel,
  isConnecting,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState(element.label);
  const [hasMoved, setHasMoved] = React.useState(false);

  const getElementConfig = () => {
    switch (element.type) {
      case 'start':
        return {
          Icon: Circle,
          color: 'text-green-600 border-green-600',
          bgColor: 'bg-green-50',
          size: 60,
          isRound: true,
        };
      case 'task':
        return {
          Icon: Square,
          color: 'text-blue-600 border-blue-600',
          bgColor: 'bg-blue-50',
          size: 100,
          isRound: false,
        };
      case 'gateway':
        return {
          Icon: Diamond,
          color: 'text-yellow-600 border-yellow-600',
          bgColor: 'bg-yellow-50',
          size: 80,
          isRound: false,
        };
      case 'end':
        return {
          Icon: CircleDot,
          color: 'text-red-600 border-red-600',
          bgColor: 'bg-red-50',
          size: 60,
          isRound: true,
        };
    }
  };

  const config = getElementConfig();
  const { Icon, color, bgColor, size, isRound } = config;

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isConnecting || isDragging) return;
    
    setIsEditing(true);
    setEditValue(element.label);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isConnecting) {
      onConnectionEnd(element.id);
      return;
    }

    if (isEditing) return;
    
    e.preventDefault();
    setHasMoved(false);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - element.position.x,
      y: e.clientY - element.position.y,
    });
    onSelect(element.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isConnecting && !isEditing) {
      setHasMoved(true);
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      onMove(element.id, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setHasMoved(false);
  };

  const handleEditSubmit = () => {
    if (editValue.trim()) {
      onUpdateLabel(element.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditValue(element.label);
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === 'Enter') {
      handleEditSubmit();
    } else if (e.key === 'Escape') {
      handleEditCancel();
    }
  };

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart, isConnecting, isEditing]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Delete' && isSelected && !isEditing) {
      onDelete(element.id);
    }
  };

  // Get border radius classes based on element type
  const getBorderRadiusClass = () => {
    if (isRound) {
      return 'rounded-full';
    } else if (element.type === 'gateway') {
      return 'rounded-lg';
    } else {
      return 'rounded-lg';
    }
  };

  return (
    <div
      className={`absolute select-none group ${isDragging ? 'z-10' : 'z-0'} ${
        isConnecting ? 'cursor-crosshair' : isEditing ? 'cursor-default' : 'cursor-move'
      }`}
      style={{
        left: element.position.x,
        top: element.position.y,
        width: size,
        height: size,
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div
        className={`
          w-full h-full ${bgColor} border-2 ${color} ${getBorderRadiusClass()}
          flex items-center justify-center transition-all duration-200
          ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2' : ''}
          ${!isEditing ? 'hover:shadow-md group-hover:scale-105' : ''}
          ${element.type === 'gateway' ? 'transform rotate-45' : ''}
        `}
      >
        <Icon 
          size={element.type === 'task' ? 24 : 20} 
          className={`${color} ${element.type === 'gateway' ? 'transform -rotate-45' : ''}`} 
        />
      </div>
      
      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-700 min-w-max">
        {isEditing ? (
          <div className="flex items-center gap-1 bg-white border-2 border-blue-400 rounded-lg px-3 py-2 shadow-lg">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={handleEditSubmit}
              className="text-xs bg-transparent outline-none min-w-20 max-w-40 text-center"
              autoFocus
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>
        ) : (
          <div 
            className="bg-white px-2 py-1 rounded border shadow-sm cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors"
            title="Double-click to edit"
            onDoubleClick={handleDoubleClick}
          >
            {element.label || element.type}
          </div>
        )}
      </div>

      {/* Connection handles */}
      {!isDragging && !isEditing && (
        <ConnectionHandle
          elementId={element.id}
          position={element.position}
          size={size}
          onConnectionStart={onConnectionStart}
          onConnectionEnd={onConnectionEnd}
          isConnecting={isConnecting}
        />
      )}

      {isSelected && !isConnecting && !isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(element.id);
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors flex items-center justify-center z-10"
        >
          ×
        </button>
      )}
    </div>
  );
};