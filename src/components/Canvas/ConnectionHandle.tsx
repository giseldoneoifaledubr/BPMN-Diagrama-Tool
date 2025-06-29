import React from 'react';

interface ConnectionHandleProps {
  elementId: string;
  position: { x: number; y: number };
  size: number;
  onConnectionStart: (elementId: string, position: { x: number; y: number }) => void;
  onConnectionEnd: (elementId: string) => void;
  isConnecting: boolean;
}

export const ConnectionHandle: React.FC<ConnectionHandleProps> = ({
  elementId,
  position,
  size,
  onConnectionStart,
  onConnectionEnd,
  isConnecting,
}) => {
  const handleMouseDown = (e: React.MouseEvent, side: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Calculate connection point relative to element center
    const centerX = position.x + size / 2;
    const centerY = position.y + size / 2;
    
    let connectionPoint = { x: centerX, y: centerY };
    
    switch (side) {
      case 'top':
        connectionPoint = { x: centerX, y: position.y };
        break;
      case 'right':
        connectionPoint = { x: position.x + size, y: centerY };
        break;
      case 'bottom':
        connectionPoint = { x: centerX, y: position.y + size };
        break;
      case 'left':
        connectionPoint = { x: position.x, y: centerY };
        break;
    }
    
    onConnectionStart(elementId, connectionPoint);
  };

  const handleMouseUp = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(elementId);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isConnecting) {
      onConnectionEnd(elementId);
    }
  };

  return (
    <>
      {/* Connection handles on all four sides */}
      {[
        { x: size / 2, y: -6, side: 'top' },
        { x: size + 6, y: size / 2, side: 'right' },
        { x: size / 2, y: size + 6, side: 'bottom' },
        { x: -6, y: size / 2, side: 'left' },
      ].map(({ x, y, side }) => (
        <div
          key={side}
          className="absolute w-3 h-3 bg-blue-500 border-2 border-white rounded-full opacity-0 group-hover:opacity-100 cursor-crosshair transition-opacity transform -translate-x-1/2 -translate-y-1/2 z-10"
          style={{
            left: x,
            top: y,
          }}
          onMouseDown={(e) => handleMouseDown(e, side)}
          onMouseUp={handleMouseUp}
          onClick={handleClick}
        />
      ))}
    </>
  );
};