import React, { useState } from 'react';
import { BPMNDiagram, BPMNElement as BPMNElementType, BPMNConnection, BPMNPool, BPMNLane, DraggedElement } from '../../types/bpmn';
import { BPMNElement } from './BPMNElement';
import { ConnectionLine } from './ConnectionLine';
import { Pool } from './Pool';

interface CanvasProps {
  diagram: BPMNDiagram;
  onUpdateDiagram: (diagram: BPMNDiagram) => void;
  draggedElement: DraggedElement | null;
}

export const Canvas: React.FC<CanvasProps> = ({ diagram, onUpdateDiagram, draggedElement }) => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStart, setConnectionStart] = useState<{ elementId: string; position: { x: number; y: number } } | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    
    if (!draggedElement) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - rect.left - draggedElement.offset.x,
      y: e.clientY - rect.top - draggedElement.offset.y,
    };

    if (draggedElement.type === 'pool') {
      const newPool: BPMNPool = {
        id: crypto.randomUUID(),
        name: `Pool ${diagram.pools.length + 1}`,
        position,
        size: { width: 400, height: 200 },
        color: '#3B82F6',
        lanes: [
          {
            id: crypto.randomUUID(),
            name: 'Lane 1',
            poolId: '',
            position: { x: 0, y: 0 },
            size: { width: 400, height: 200 },
          }
        ],
      };
      
      // Update lane poolId
      newPool.lanes![0].poolId = newPool.id;

      const updatedDiagram = {
        ...diagram,
        pools: [...diagram.pools, newPool],
      };

      onUpdateDiagram(updatedDiagram);
    } else {
      // Check if dropped inside a pool
      let poolId: string | undefined;
      for (const pool of diagram.pools) {
        if (
          position.x >= pool.position.x &&
          position.x <= pool.position.x + pool.size.width &&
          position.y >= pool.position.y &&
          position.y <= pool.position.y + pool.size.height
        ) {
          poolId = pool.id;
          break;
        }
      }

      const newElement: BPMNElementType = {
        id: crypto.randomUUID(),
        type: draggedElement.type as BPMNElementType['type'],
        position,
        label: `${draggedElement.type.charAt(0).toUpperCase() + draggedElement.type.slice(1)} ${diagram.elements.length + 1}`,
        poolId,
      };

      const updatedDiagram = {
        ...diagram,
        elements: [...diagram.elements, newElement],
      };

      onUpdateDiagram(updatedDiagram);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleElementMove = (id: string, position: { x: number; y: number }) => {
    if (isConnecting) return;
    
    // Check if element is being moved into a different pool
    let poolId: string | undefined;
    for (const pool of diagram.pools) {
      if (
        position.x >= pool.position.x &&
        position.x <= pool.position.x + pool.size.width &&
        position.y >= pool.position.y &&
        position.y <= pool.position.y + pool.size.height
      ) {
        poolId = pool.id;
        break;
      }
    }
    
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.map(el =>
        el.id === id ? { ...el, position, poolId } : el
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handlePoolMove = (id: string, position: { x: number; y: number }) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(pool =>
        pool.id === id ? { ...pool, position } : pool
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handlePoolResize = (id: string, size: { width: number; height: number }) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(pool =>
        pool.id === id ? { ...pool, size } : pool
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handlePoolDelete = (id: string) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.filter(pool => pool.id !== id),
      elements: diagram.elements.map(el => 
        el.poolId === id ? { ...el, poolId: undefined } : el
      ),
    };
    onUpdateDiagram(updatedDiagram);
    setSelectedPoolId(null);
  };

  const handlePoolUpdateName = (id: string, name: string) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(pool =>
        pool.id === id ? { ...pool, name } : pool
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleAddLane = (poolId: string) => {
    const pool = diagram.pools.find(p => p.id === poolId);
    if (!pool) return;

    const newLane: BPMNLane = {
      id: crypto.randomUUID(),
      name: `Lane ${(pool.lanes?.length || 0) + 1}`,
      poolId,
      position: { x: 0, y: 0 },
      size: { width: pool.size.width, height: pool.size.height / ((pool.lanes?.length || 0) + 1) },
    };

    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(p =>
        p.id === poolId 
          ? { ...p, lanes: [...(p.lanes || []), newLane] }
          : p
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleDeleteLane = (poolId: string, laneId: string) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(pool =>
        pool.id === poolId 
          ? { ...pool, lanes: pool.lanes?.filter(lane => lane.id !== laneId) || [] }
          : pool
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleUpdateLane = (poolId: string, laneId: string, name: string) => {
    const updatedDiagram = {
      ...diagram,
      pools: diagram.pools.map(pool =>
        pool.id === poolId 
          ? { 
              ...pool, 
              lanes: pool.lanes?.map(lane => 
                lane.id === laneId ? { ...lane, name } : lane
              ) || []
            }
          : pool
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleElementDelete = (id: string) => {
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.filter(el => el.id !== id),
      connections: diagram.connections.filter(conn => 
        conn.source !== id && conn.target !== id
      ),
    };
    onUpdateDiagram(updatedDiagram);
    setSelectedElementId(null);
  };

  const handleElementLabelUpdate = (id: string, label: string) => {
    const updatedDiagram = {
      ...diagram,
      elements: diagram.elements.map(el =>
        el.id === id ? { ...el, label } : el
      ),
    };
    onUpdateDiagram(updatedDiagram);
  };

  const handleConnectionStart = (elementId: string, position: { x: number; y: number }) => {
    setIsConnecting(true);
    setConnectionStart({ elementId, position });
    setSelectedElementId(null);
    setSelectedConnectionId(null);
    setSelectedPoolId(null);
  };

  const handleConnectionEnd = (targetElementId: string) => {
    if (connectionStart && connectionStart.elementId !== targetElementId) {
      const existingConnection = diagram.connections.find(
        conn => conn.source === connectionStart.elementId && conn.target === targetElementId
      );
      
      if (!existingConnection) {
        const newConnection: BPMNConnection = {
          id: crypto.randomUUID(),
          source: connectionStart.elementId,
          target: targetElementId,
        };

        const updatedDiagram = {
          ...diagram,
          connections: [...diagram.connections, newConnection],
        };

        onUpdateDiagram(updatedDiagram);
      }
    }
    
    setIsConnecting(false);
    setConnectionStart(null);
  };

  const handleConnectionDelete = (id: string) => {
    const updatedDiagram = {
      ...diagram,
      connections: diagram.connections.filter(conn => conn.id !== id),
    };
    onUpdateDiagram(updatedDiagram);
    setSelectedConnectionId(null);
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedElementId(null);
      setSelectedConnectionId(null);
      setSelectedPoolId(null);
      if (isConnecting) {
        setIsConnecting(false);
        setConnectionStart(null);
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isConnecting) {
      const rect = e.currentTarget.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="flex-1 relative overflow-hidden bg-gray-50">
      <div
        className="w-full h-full relative"
        style={{
          backgroundImage: 'radial-gradient(circle, #e5e7eb 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
      >
        {/* Pools (rendered first, behind elements) */}
        <div style={{ zIndex: 1 }} className="relative">
          {diagram.pools.map((pool) => (
            <Pool
              key={pool.id}
              pool={pool}
              isSelected={selectedPoolId === pool.id}
              onSelect={setSelectedPoolId}
              onMove={handlePoolMove}
              onResize={handlePoolResize}
              onDelete={handlePoolDelete}
              onUpdateName={handlePoolUpdateName}
              onAddLane={handleAddLane}
              onDeleteLane={handleDeleteLane}
              onUpdateLane={handleUpdateLane}
            />
          ))}
        </div>

        {/* SVG for connections */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#6B7280"
              />
            </marker>
            <marker
              id="arrowhead-selected"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon
                points="0 0, 10 3.5, 0 7"
                fill="#3B82F6"
              />
            </marker>
          </defs>
          
          {diagram.connections.map((connection) => {
            const sourceElement = diagram.elements.find(el => el.id === connection.source);
            const targetElement = diagram.elements.find(el => el.id === connection.target);
            
            if (!sourceElement || !targetElement) return null;
            
            return (
              <ConnectionLine
                key={connection.id}
                connection={connection}
                sourceElement={sourceElement}
                targetElement={targetElement}
                isSelected={selectedConnectionId === connection.id}
                onSelect={setSelectedConnectionId}
                onDelete={handleConnectionDelete}
              />
            );
          })}

          {isConnecting && connectionStart && (
            <line
              x1={connectionStart.position.x}
              y1={connectionStart.position.y}
              x2={mousePosition.x}
              y2={mousePosition.y}
              stroke="#3B82F6"
              strokeWidth={2}
              strokeDasharray="5,5"
              className="pointer-events-none"
            />
          )}
        </svg>

        {/* Elements (rendered on top of pools) */}
        <div style={{ zIndex: 15 }} className="relative">
          {diagram.elements.map((element) => (
            <BPMNElement
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={setSelectedElementId}
              onMove={handleElementMove}
              onDelete={handleElementDelete}
              onUpdateLabel={handleElementLabelUpdate}
              onConnectionStart={handleConnectionStart}
              onConnectionEnd={handleConnectionEnd}
              isConnecting={isConnecting}
            />
          ))}
        </div>

        {/* Empty state */}
        {diagram.elements.length === 0 && diagram.pools.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 0 }}>
            <div className="text-center">
              <div className="text-gray-400 text-lg mb-2">Empty Canvas</div>
              <div className="text-gray-500 text-sm">
                Drag elements from the toolbar to start creating your BPMN diagram
              </div>
              <div className="text-gray-400 text-xs mt-2">
                Use pools to organize elements by participants or departments
              </div>
              <div className="text-gray-400 text-xs mt-1">
                Double-click on elements to rename them
              </div>
            </div>
          </div>
        )}

        {/* Connection mode indicator */}
        {isConnecting && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg z-20">
            <div className="text-sm font-medium">Connection Mode</div>
            <div className="text-xs opacity-90">Click on another element to connect, or click canvas to cancel</div>
          </div>
        )}
      </div>
    </div>
  );
};