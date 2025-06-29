import React from 'react';
import { Circle, Square, Diamond, CircleDot, Download, Save, Layers } from 'lucide-react';
import { BPMNElement } from '../types/bpmn';

interface ToolbarProps {
  onDragStart: (elementType: BPMNElement['type'] | 'pool', event: React.DragEvent) => void;
  onExport: (format: 'mermaid' | 'bpmn') => void;
  onSave: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onDragStart, onExport, onSave }) => {
  const elements = [
    { type: 'start' as const, icon: Circle, label: 'Start Event', color: 'text-green-600' },
    { type: 'task' as const, icon: Square, label: 'Task', color: 'text-blue-600' },
    { type: 'gateway' as const, icon: Diamond, label: 'Gateway', color: 'text-yellow-600' },
    { type: 'end' as const, icon: CircleDot, label: 'End Event', color: 'text-red-600' },
    { type: 'pool' as const, icon: Layers, label: 'Pool', color: 'text-purple-600' },
  ];

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-gray-700">Elements</h2>
          <div className="flex items-center gap-2">
            {elements.map(({ type, icon: Icon, label, color }) => (
              <div
                key={type}
                draggable
                onDragStart={(e) => onDragStart(type, e)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-grab active:cursor-grabbing transition-colors border border-gray-200"
                title={label}
              >
                <Icon size={18} className={color} />
                <span className="text-sm text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Save size={16} />
            Save
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
              <Download size={16} />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
              <button
                onClick={() => onExport('mermaid')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg"
              >
                Export as Mermaid
              </button>
              <button
                onClick={() => onExport('bpmn')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 last:rounded-b-lg"
              >
                Export as BPMN 2.0
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};