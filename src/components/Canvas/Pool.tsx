import React, { useState } from 'react';
import { Edit2, Trash2, Plus } from 'lucide-react';
import { BPMNPool, BPMNLane } from '../../types/bpmn';

interface PoolProps {
  pool: BPMNPool;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onMove: (id: string, position: { x: number; y: number }) => void;
  onResize: (id: string, size: { width: number; height: number }) => void;
  onDelete: (id: string) => void;
  onUpdateName: (id: string, name: string) => void;
  onAddLane: (poolId: string) => void;
  onDeleteLane: (poolId: string, laneId: string) => void;
  onUpdateLane: (poolId: string, laneId: string, name: string) => void;
}

export const Pool: React.FC<PoolProps> = ({
  pool,
  isSelected,
  onSelect,
  onMove,
  onResize,
  onDelete,
  onUpdateName,
  onAddLane,
  onDeleteLane,
  onUpdateLane,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isEditingName, setIsEditingName] = useState(false);
  const [editNameValue, setEditNameValue] = useState(pool.name);
  const [editingLaneId, setEditingLaneId] = useState<string | null>(null);
  const [editLaneValue, setEditLaneValue] = useState('');

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isEditingName || editingLaneId) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - pool.position.x,
      y: e.clientY - pool.position.y,
    });
    onSelect(pool.id);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isEditingName && !editingLaneId) {
      const newPosition = {
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      };
      onMove(pool.id, newPosition);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsResizing(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
    });
  };

  const handleResizeMouseMove = (e: MouseEvent) => {
    if (isResizing) {
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      const newSize = {
        width: Math.max(200, pool.size.width + deltaX),
        height: Math.max(150, pool.size.height + deltaY),
      };
      onResize(pool.id, newSize);
      setDragStart({ x: e.clientX, y: e.clientY });
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
  }, [isDragging, dragStart]);

  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleResizeMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, dragStart]);

  const handleNameEdit = () => {
    if (editNameValue.trim()) {
      onUpdateName(pool.id, editNameValue.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameEdit();
    } else if (e.key === 'Escape') {
      setEditNameValue(pool.name);
      setIsEditingName(false);
    }
  };

  const handleLaneEdit = (laneId: string) => {
    if (editLaneValue.trim()) {
      onUpdateLane(pool.id, laneId, editLaneValue.trim());
    }
    setEditingLaneId(null);
    setEditLaneValue('');
  };

  const handleLaneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLaneEdit(editingLaneId!);
    } else if (e.key === 'Escape') {
      setEditingLaneId(null);
      setEditLaneValue('');
    }
  };

  const startLaneEdit = (lane: BPMNLane) => {
    setEditingLaneId(lane.id);
    setEditLaneValue(lane.name);
  };

  const laneHeight = pool.lanes && pool.lanes.length > 0 
    ? pool.size.height / pool.lanes.length 
    : pool.size.height;

  return (
    <div
      className={`absolute select-none group ${isDragging ? 'z-20' : 'z-5'}`}
      style={{
        left: pool.position.x,
        top: pool.position.y,
        width: pool.size.width,
        height: pool.size.height,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Pool Container */}
      <div
        className={`w-full h-full border-2 rounded-lg transition-all duration-200 ${
          isSelected 
            ? 'ring-2 ring-blue-400 ring-offset-2 border-blue-500' 
            : 'border-gray-400 hover:border-gray-600'
        }`}
        style={{ backgroundColor: `${pool.color}20` }}
      >
        {/* Pool Header */}
        <div 
          className="h-8 border-b border-gray-400 flex items-center justify-between px-2"
          style={{ backgroundColor: `${pool.color}40` }}
        >
          <div className="flex items-center gap-2 flex-1">
            {isEditingName ? (
              <input
                type="text"
                value={editNameValue}
                onChange={(e) => setEditNameValue(e.target.value)}
                onKeyDown={handleNameKeyDown}
                onBlur={handleNameEdit}
                className="text-sm font-medium bg-transparent border-none outline-none flex-1"
                autoFocus
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
              />
            ) : (
              <span 
                className="text-sm font-medium text-gray-800 cursor-pointer flex-1"
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
              >
                {pool.name}
              </span>
            )}
          </div>
          
          {isSelected && !isEditingName && (
            <div className="flex items-center gap-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddLane(pool.id);
                }}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Add Lane"
              >
                <Plus size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditingName(true);
                }}
                className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-100 rounded transition-colors"
                title="Edit Name"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(pool.id);
                }}
                className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                title="Delete Pool"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Lanes */}
        <div className="flex-1 relative">
          {pool.lanes && pool.lanes.length > 0 ? (
            pool.lanes.map((lane, index) => (
              <div
                key={lane.id}
                className="border-b border-gray-300 last:border-b-0 flex"
                style={{ height: laneHeight }}
              >
                {/* Lane Label */}
                <div 
                  className="w-24 border-r border-gray-300 flex items-center justify-center p-2"
                  style={{ backgroundColor: `${pool.color}20` }}
                >
                  {editingLaneId === lane.id ? (
                    <input
                      type="text"
                      value={editLaneValue}
                      onChange={(e) => setEditLaneValue(e.target.value)}
                      onKeyDown={handleLaneKeyDown}
                      onBlur={() => handleLaneEdit(lane.id)}
                      className="text-xs bg-transparent border-none outline-none text-center w-full"
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                      onMouseDown={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <div className="flex items-center gap-1 w-full">
                      <span 
                        className="text-xs font-medium text-gray-700 cursor-pointer flex-1 text-center"
                        onDoubleClick={(e) => {
                          e.stopPropagation();
                          startLaneEdit(lane);
                        }}
                      >
                        {lane.name}
                      </span>
                      {isSelected && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLane(pool.id, lane.id);
                          }}
                          className="p-0.5 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Lane"
                        >
                          <Trash2 size={10} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Lane Content Area */}
                <div className="flex-1 relative">
                  {/* Drop zone for elements */}
                </div>
              </div>
            ))
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
              <span>Pool Content Area</span>
            </div>
          )}
        </div>
      </div>

      {/* Resize Handle */}
      {isSelected && (
        <div
          className="absolute bottom-0 right-0 w-4 h-4 bg-blue-500 cursor-se-resize opacity-75 hover:opacity-100 transition-opacity"
          onMouseDown={handleResizeMouseDown}
          style={{
            clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          }}
        />
      )}
    </div>
  );
};