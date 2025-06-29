import React from 'react';
import { BPMNConnection, BPMNElement } from '../../types/bpmn';

interface ConnectionLineProps {
  connection: BPMNConnection;
  sourceElement: BPMNElement;
  targetElement: BPMNElement;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourceElement,
  targetElement,
  isSelected,
  onSelect,
  onDelete,
}) => {
  const getElementSize = (element: BPMNElement) => {
    switch (element.type) {
      case 'task':
        return 100;
      case 'gateway':
        return 80;
      default:
        return 60;
    }
  };

  const getElementCenter = (element: BPMNElement) => {
    const size = getElementSize(element);
    return {
      x: element.position.x + size / 2,
      y: element.position.y + size / 2,
    };
  };

  const sourceCenter = getElementCenter(sourceElement);
  const targetCenter = getElementCenter(targetElement);

  // Calculate the connection points on the edges of the elements
  const getConnectionPoints = () => {
    const dx = targetCenter.x - sourceCenter.x;
    const dy = targetCenter.y - sourceCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance === 0) return { start: sourceCenter, end: targetCenter };
    
    const sourceSize = getElementSize(sourceElement);
    const targetSize = getElementSize(targetElement);
    
    // Calculate unit vector
    const unitX = dx / distance;
    const unitY = dy / distance;
    
    // Calculate connection points on element edges
    const sourceRadius = sourceSize / 2;
    const targetRadius = targetSize / 2;
    
    const start = {
      x: sourceCenter.x + unitX * sourceRadius,
      y: sourceCenter.y + unitY * sourceRadius,
    };
    
    const end = {
      x: targetCenter.x - unitX * targetRadius,
      y: targetCenter.y - unitY * targetRadius,
    };
    
    return { start, end };
  };

  const { start, end } = getConnectionPoints();

  // Calculate midpoint for label and delete button
  const midPoint = {
    x: (start.x + end.x) / 2,
    y: (start.y + end.y) / 2,
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(connection.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(connection.id);
  };

  return (
    <g className="pointer-events-auto">
      {/* Invisible thicker line for easier clicking */}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="transparent"
        strokeWidth={12}
        className="cursor-pointer"
        onClick={handleClick}
      />
      
      {/* Main line */}
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke={isSelected ? '#3B82F6' : '#6B7280'}
        strokeWidth={isSelected ? 3 : 2}
        className="cursor-pointer hover:stroke-blue-500 transition-colors"
        markerEnd={isSelected ? "url(#arrowhead-selected)" : "url(#arrowhead)"}
        onClick={handleClick}
      />

      {/* Connection label */}
      {connection.label && (
        <g onClick={handleClick} className="cursor-pointer">
          <rect
            x={midPoint.x - 30}
            y={midPoint.y - 10}
            width={60}
            height={20}
            fill="white"
            stroke={isSelected ? '#3B82F6' : '#E5E7EB'}
            strokeWidth={1}
            rx={4}
          />
          <text
            x={midPoint.x}
            y={midPoint.y + 4}
            textAnchor="middle"
            className="text-xs fill-gray-700 pointer-events-none select-none"
          >
            {connection.label}
          </text>
        </g>
      )}

      {/* Delete button when selected */}
      {isSelected && (
        <g onClick={handleDeleteClick} className="cursor-pointer">
          <circle
            cx={midPoint.x + 40}
            cy={midPoint.y - 15}
            r={8}
            fill="#EF4444"
            className="hover:fill-red-600 transition-colors"
          />
          <text
            x={midPoint.x + 40}
            y={midPoint.y - 11}
            textAnchor="middle"
            className="text-xs fill-white pointer-events-none select-none font-bold"
          >
            ×
          </text>
        </g>
      )}
    </g>
  );
};