export interface BPMNElement {
  id: string;
  type: 'start' | 'task' | 'gateway' | 'end';
  position: { x: number; y: number };
  label: string;
  poolId?: string; // Reference to the pool this element belongs to
  properties?: Record<string, any>;
}

export interface BPMNConnection {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface BPMNPool {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: string;
  lanes?: BPMNLane[];
}

export interface BPMNLane {
  id: string;
  name: string;
  poolId: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
}

export interface BPMNDiagram {
  id: string;
  name: string;
  elements: BPMNElement[];
  connections: BPMNConnection[];
  pools: BPMNPool[];
  createdAt: Date;
  updatedAt: Date;
}

export interface DraggedElement {
  type: BPMNElement['type'] | 'pool';
  offset: { x: number; y: number };
}