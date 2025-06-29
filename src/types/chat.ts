export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GroqSettings {
  apiKey: string;
  model: string;
}

export interface DiagramModification {
  type: 'add_element' | 'remove_element' | 'modify_element' | 'add_connection' | 'remove_connection' | 'clear_diagram' | 'add_pool' | 'remove_pool' | 'modify_pool' | 'add_lane' | 'remove_lane';
  elementId?: string;
  elementType?: 'start' | 'task' | 'gateway' | 'end';
  position?: { x: number; y: number };
  label?: string;
  sourceId?: string;
  targetId?: string;
  connectionLabel?: string;
  poolId?: string;
  poolName?: string;
  poolSize?: { width: number; height: number };
  poolColor?: string;
  laneId?: string;
  laneName?: string;
}