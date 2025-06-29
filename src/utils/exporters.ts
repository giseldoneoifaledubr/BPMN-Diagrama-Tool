import { BPMNDiagram } from '../types/bpmn';

export const exportToMermaid = (diagram: BPMNDiagram): string => {
  let mermaid = 'flowchart TD\n';
  
  // Add elements
  diagram.elements.forEach(element => {
    const shape = getElementShape(element.type);
    mermaid += `    ${element.id}${shape.start}"${element.label}"${shape.end}\n`;
  });

  // Add connections
  diagram.connections.forEach(connection => {
    const label = connection.label ? `|${connection.label}|` : '';
    mermaid += `    ${connection.source} -->${label} ${connection.target}\n`;
  });

  // Add styling
  mermaid += '\n';
  diagram.elements.forEach(element => {
    const style = getElementStyle(element.type);
    mermaid += `    classDef ${element.type}Class ${style}\n`;
    mermaid += `    class ${element.id} ${element.type}Class\n`;
  });

  return mermaid;
};

const getElementShape = (type: string) => {
  switch (type) {
    case 'start':
      return { start: '((', end: '))' };
    case 'task':
      return { start: '[', end: ']' };
    case 'gateway':
      return { start: '{', end: '}' };
    case 'end':
      return { start: '(((', end: ')))' };
    default:
      return { start: '[', end: ']' };
  }
};

const getElementStyle = (type: string) => {
  switch (type) {
    case 'start':
      return 'fill:#d1fae5,stroke:#10b981,stroke-width:2px';
    case 'task':
      return 'fill:#dbeafe,stroke:#3b82f6,stroke-width:2px';
    case 'gateway':
      return 'fill:#fef3c7,stroke:#f59e0b,stroke-width:2px';
    case 'end':
      return 'fill:#fee2e2,stroke:#ef4444,stroke-width:2px';
    default:
      return 'fill:#f3f4f6,stroke:#6b7280,stroke-width:2px';
  }
};

export const exportToBPMN = (diagram: BPMNDiagram): string => {
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" 
             xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
             xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" 
             xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
             xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
             targetNamespace="http://bpmn.io/schema/bpmn"
             exporter="BPMN Designer" 
             exporterVersion="1.0.0">
  
  <process id="Process_${diagram.id}" isExecutable="true">
${diagram.elements.map(element => getBPMNElement(element)).join('\n')}
${diagram.connections.map(connection => getBPMNSequenceFlow(connection)).join('\n')}
  </process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_${diagram.id}">
${diagram.elements.map(element => getBPMNShape(element)).join('\n')}
${diagram.connections.map(connection => getBPMNEdge(connection, diagram.elements)).join('\n')}
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</definitions>`;

  return xml;
};

const getBPMNElement = (element: any) => {
  switch (element.type) {
    case 'start':
      return `    <startEvent id="${element.id}" name="${element.label}" />`;
    case 'task':
      return `    <task id="${element.id}" name="${element.label}" />`;
    case 'gateway':
      return `    <exclusiveGateway id="${element.id}" name="${element.label}" />`;
    case 'end':
      return `    <endEvent id="${element.id}" name="${element.label}" />`;
    default:
      return `    <task id="${element.id}" name="${element.label}" />`;
  }
};

const getBPMNSequenceFlow = (connection: any) => {
  const name = connection.label ? ` name="${connection.label}"` : '';
  return `    <sequenceFlow id="${connection.id}" sourceRef="${connection.source}" targetRef="${connection.target}"${name} />`;
};

const getBPMNShape = (element: any) => {
  const { x, y } = element.position;
  const width = element.type === 'task' ? 100 : 36;
  const height = element.type === 'task' ? 80 : 36;
  
  return `      <bpmndi:BPMNShape id="${element.id}_di" bpmnElement="${element.id}">
        <dc:Bounds x="${x}" y="${y}" width="${width}" height="${height}" />
        <bpmndi:BPMNLabel>
          <dc:Bounds x="${x}" y="${y + height + 5}" width="${width}" height="14" />
        </bpmndi:BPMNLabel>
      </bpmndi:BPMNShape>`;
};

const getBPMNEdge = (connection: any, elements: any[]) => {
  const source = elements.find(el => el.id === connection.source);
  const target = elements.find(el => el.id === connection.target);
  
  if (!source || !target) return '';
  
  const sourceSize = source.type === 'task' ? 100 : source.type === 'gateway' ? 80 : 60;
  const targetSize = target.type === 'task' ? 100 : target.type === 'gateway' ? 80 : 60;
  
  return `      <bpmndi:BPMNEdge id="${connection.id}_di" bpmnElement="${connection.id}">
        <di:waypoint x="${source.position.x + sourceSize / 2}" y="${source.position.y + sourceSize / 2}" />
        <di:waypoint x="${target.position.x + targetSize / 2}" y="${target.position.y + targetSize / 2}" />
        ${connection.label ? `<bpmndi:BPMNLabel>
          <dc:Bounds x="${(source.position.x + target.position.x) / 2 - 15}" y="${(source.position.y + target.position.y) / 2 - 7}" width="30" height="14" />
        </bpmndi:BPMNLabel>` : ''}
      </bpmndi:BPMNEdge>`;
};