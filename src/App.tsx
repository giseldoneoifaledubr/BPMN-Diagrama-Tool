import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { ChatPanel } from './components/Chat/ChatPanel';
import { AboutPage } from './components/About/AboutPage';
import { HelpPage } from './components/Help/HelpPage';
import { useDiagrams } from './hooks/useDiagrams';
import { useChat } from './hooks/useChat';
import { DraggedElement, BPMNElement } from './types/bpmn';
import { exportToMermaid, exportToBPMN } from './utils/exporters';
import { applyModifications } from './utils/diagramModifier';

function App() {
  const {
    diagrams,
    currentDiagram,
    createDiagram,
    updateDiagram,
    renameDiagram,
    deleteDiagram,
    selectDiagram,
  } = useDiagrams();

  const {
    messages,
    settings,
    isLoading,
    sendMessage,
    updateSettings,
  } = useChat();

  const [draggedElement, setDraggedElement] = useState<DraggedElement | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const handleDragStart = (elementType: BPMNElement['type'] | 'pool', event: React.DragEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    setDraggedElement({
      type: elementType,
      offset: {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      },
    });
  };

  const handleCreateDiagram = (name: string) => {
    createDiagram(name);
  };

  const handleRenameDiagram = (id: string, newName: string) => {
    renameDiagram(id, newName);
  };

  const handleExport = (format: 'mermaid' | 'bpmn') => {
    if (!currentDiagram) return;

    const content = format === 'mermaid' 
      ? exportToMermaid(currentDiagram)
      : exportToBPMN(currentDiagram);

    const blob = new Blob([content], { 
      type: format === 'mermaid' ? 'text/plain' : 'application/xml' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentDiagram.name}.${format === 'mermaid' ? 'mmd' : 'bpmn'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (currentDiagram) {
      updateDiagram(currentDiagram);
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!currentDiagram) {
      return;
    }

    try {
      const modifications = await sendMessage(message, currentDiagram);
      
      if (modifications.length > 0) {
        const updatedDiagram = applyModifications(currentDiagram, modifications);
        updateDiagram(updatedDiagram);
      }
    } catch (error) {
      console.error('Error processing chat message:', error);
    }
  };

  // Create a default diagram if none exist
  React.useEffect(() => {
    if (diagrams.length === 0) {
      createDiagram('My First Diagram');
    }
  }, [diagrams.length]);

  return (
    <div className="h-screen flex bg-white font-sans">
      <Sidebar
        diagrams={diagrams}
        currentDiagram={currentDiagram}
        onCreateDiagram={handleCreateDiagram}
        onSelectDiagram={selectDiagram}
        onDeleteDiagram={deleteDiagram}
        onRenameDiagram={handleRenameDiagram}
        onShowAbout={() => setShowAbout(true)}
        onShowHelp={() => setShowHelp(true)}
      />
      
      <div className="flex-1 flex flex-col">
        <Toolbar
          onDragStart={handleDragStart}
          onExport={handleExport}
          onSave={handleSave}
        />
        
        {currentDiagram ? (
          <Canvas
            diagram={currentDiagram}
            onUpdateDiagram={updateDiagram}
            draggedElement={draggedElement}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Welcome to BPMN Designer
              </h2>
              <p className="text-gray-600">
                Create your first diagram to get started
              </p>
            </div>
          </div>
        )}
      </div>

      <ChatPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        messages={messages}
        onSendMessage={handleChatMessage}
        isLoading={isLoading}
        settings={settings}
        onUpdateSettings={updateSettings}
      />

      {showAbout && (
        <AboutPage onClose={() => setShowAbout(false)} />
      )}

      {showHelp && (
        <HelpPage onClose={() => setShowHelp(false)} />
      )}
    </div>
  );
}

export default App;