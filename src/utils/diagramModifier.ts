import { BPMNDiagram, BPMNElement, BPMNConnection, BPMNPool, BPMNLane } from '../types/bpmn';
import { DiagramModification } from '../types/chat';

export const applyModifications = (
  diagram: BPMNDiagram,
  modifications: DiagramModification[]
): BPMNDiagram => {
  let updatedDiagram = { ...diagram };

  for (const modification of modifications) {
    updatedDiagram = applyModification(updatedDiagram, modification);
  }

  return {
    ...updatedDiagram,
    updatedAt: new Date(),
  };
};

const applyModification = (
  diagram: BPMNDiagram,
  modification: DiagramModification
): BPMNDiagram => {
  switch (modification.type) {
    case 'add_element':
      return addElement(diagram, modification);
    
    case 'remove_element':
      return removeElement(diagram, modification);
    
    case 'modify_element':
      return modifyElement(diagram, modification);
    
    case 'add_connection':
      return addConnection(diagram, modification);
    
    case 'remove_connection':
      return removeConnection(diagram, modification);
    
    case 'add_pool':
      return addPool(diagram, modification);
    
    case 'remove_pool':
      return removePool(diagram, modification);
    
    case 'modify_pool':
      return modifyPool(diagram, modification);
    
    case 'add_lane':
      return addLane(diagram, modification);
    
    case 'remove_lane':
      return removeLane(diagram, modification);
    
    case 'clear_diagram':
      return clearDiagram(diagram);
    
    default:
      console.warn('Unknown modification type:', modification);
      return diagram;
  }
};

const addElement = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.elementType || !modification.position || !modification.label) {
    console.warn('Invalid add_element modification:', modification);
    return diagram;
  }

  const newElement: BPMNElement = {
    id: crypto.randomUUID(),
    type: modification.elementType,
    position: modification.position,
    label: modification.label,
    poolId: modification.poolId,
  };

  return {
    ...diagram,
    elements: [...diagram.elements, newElement],
  };
};

const removeElement = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.elementId) {
    console.warn('Invalid remove_element modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    elements: diagram.elements.filter(el => el.id !== modification.elementId),
    connections: diagram.connections.filter(conn => 
      conn.source !== modification.elementId && conn.target !== modification.elementId
    ),
  };
};

const modifyElement = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.elementId || !modification.label) {
    console.warn('Invalid modify_element modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    elements: diagram.elements.map(el =>
      el.id === modification.elementId
        ? { ...el, label: modification.label! }
        : el
    ),
  };
};

const addConnection = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.sourceId || !modification.targetId) {
    console.warn('Invalid add_connection modification:', modification);
    return diagram;
  }

  const sourceExists = diagram.elements.some(el => el.id === modification.sourceId);
  const targetExists = diagram.elements.some(el => el.id === modification.targetId);
  
  if (!sourceExists || !targetExists) {
    console.warn('Source or target element not found for connection:', modification);
    return diagram;
  }

  const connectionExists = diagram.connections.some(conn =>
    conn.source === modification.sourceId && conn.target === modification.targetId
  );

  if (connectionExists) {
    console.warn('Connection already exists:', modification);
    return diagram;
  }

  const newConnection: BPMNConnection = {
    id: crypto.randomUUID(),
    source: modification.sourceId,
    target: modification.targetId,
    label: modification.connectionLabel,
  };

  return {
    ...diagram,
    connections: [...diagram.connections, newConnection],
  };
};

const removeConnection = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.sourceId || !modification.targetId) {
    console.warn('Invalid remove_connection modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    connections: diagram.connections.filter(conn =>
      !(conn.source === modification.sourceId && conn.target === modification.targetId)
    ),
  };
};

const addPool = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.poolName || !modification.position) {
    console.warn('Invalid add_pool modification:', modification);
    return diagram;
  }

  const newPool: BPMNPool = {
    id: crypto.randomUUID(),
    name: modification.poolName,
    position: modification.position,
    size: modification.poolSize || { width: 400, height: 200 },
    color: modification.poolColor || '#3B82F6',
    lanes: [
      {
        id: crypto.randomUUID(),
        name: 'Lane 1',
        poolId: '',
        position: { x: 0, y: 0 },
        size: modification.poolSize || { width: 400, height: 200 },
      }
    ],
  };

  // Update lane poolId
  newPool.lanes![0].poolId = newPool.id;

  return {
    ...diagram,
    pools: [...diagram.pools, newPool],
  };
};

const removePool = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.poolId) {
    console.warn('Invalid remove_pool modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    pools: diagram.pools.filter(pool => pool.id !== modification.poolId),
    elements: diagram.elements.map(el => 
      el.poolId === modification.poolId ? { ...el, poolId: undefined } : el
    ),
  };
};

const modifyPool = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.poolId) {
    console.warn('Invalid modify_pool modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    pools: diagram.pools.map(pool =>
      pool.id === modification.poolId
        ? { 
            ...pool, 
            name: modification.poolName || pool.name,
            size: modification.poolSize || pool.size,
            color: modification.poolColor || pool.color,
          }
        : pool
    ),
  };
};

const addLane = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.poolId || !modification.laneName) {
    console.warn('Invalid add_lane modification:', modification);
    return diagram;
  }

  const pool = diagram.pools.find(p => p.id === modification.poolId);
  if (!pool) {
    console.warn('Pool not found for add_lane:', modification);
    return diagram;
  }

  const newLane: BPMNLane = {
    id: crypto.randomUUID(),
    name: modification.laneName,
    poolId: modification.poolId,
    position: { x: 0, y: 0 },
    size: { width: pool.size.width, height: pool.size.height / ((pool.lanes?.length || 0) + 1) },
  };

  return {
    ...diagram,
    pools: diagram.pools.map(p =>
      p.id === modification.poolId 
        ? { ...p, lanes: [...(p.lanes || []), newLane] }
        : p
    ),
  };
};

const removeLane = (diagram: BPMNDiagram, modification: DiagramModification): BPMNDiagram => {
  if (!modification.poolId || !modification.laneId) {
    console.warn('Invalid remove_lane modification:', modification);
    return diagram;
  }

  return {
    ...diagram,
    pools: diagram.pools.map(pool =>
      pool.id === modification.poolId 
        ? { ...pool, lanes: pool.lanes?.filter(lane => lane.id !== modification.laneId) || [] }
        : pool
    ),
  };
};

const clearDiagram = (diagram: BPMNDiagram): BPMNDiagram => {
  return {
    ...diagram,
    elements: [],
    connections: [],
    pools: [],
  };
};