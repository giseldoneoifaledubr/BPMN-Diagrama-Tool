import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { Canvas } from './components/Canvas/Canvas';
import { ChatPanel } from './components/Chat/ChatPanel';
import { AboutPage } from './components/About/AboutPage';
import { HelpPage } from './components/Help/HelpPage';
import { AuthModal } from './components/Auth/AuthModal';
import { useDiagrams } from './hooks/useDiagrams';
import { useChat } from './hooks/useChat';
import { useAuth } from './hooks/useAuth';
import { DraggedElement, BPMNElement } from './types/bpmn';
import { exportToMermaid, exportToBPMN } from './utils/exporters';
import { applyModifications } from './utils/diagramModifier';

function App() {
  const { user, loading: authLoading } = useAuth();
  const {
    diagrams,
    currentDiagram,
    loading: diagramsLoading,
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
  const [showAuth, setShowAuth] = useState(false);

  // Debug logs
  useEffect(() => {
    console.log('App state:', {
      authLoading,
      user: user?.email,
      diagramsLoading,
      diagramsCount: diagrams.length,
      currentDiagram: currentDiagram?.name,
    });
  }, [authLoading, user, diagramsLoading, diagrams.length, currentDiagram]);

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

  const handleCreateDiagram = async (name: string) => {
    await createDiagram(name);
  };

  const handleRenameDiagram = async (id: string, newName: string) => {
    await renameDiagram(id, newName);
  };

  const handleDeleteDiagram = async (id: string) => {
    await deleteDiagram(id);
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

  const handleSave = async () => {
    if (currentDiagram) {
      await updateDiagram(currentDiagram);
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
        await updateDiagram(updatedDiagram);
      }
    } catch (error) {
      console.error('Error processing chat message:', error);
    }
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando aplicação...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-white font-sans">
      <Sidebar
        diagrams={diagrams}
        currentDiagram={currentDiagram}
        onCreateDiagram={handleCreateDiagram}
        onSelectDiagram={selectDiagram}
        onDeleteDiagram={handleDeleteDiagram}
        onRenameDiagram={handleRenameDiagram}
        onShowAbout={() => setShowAbout(true)}
        onShowHelp={() => setShowHelp(true)}
        onShowAuth={() => setShowAuth(true)}
      />
      
      <div className="flex-1 flex flex-col">
        {user && (
          <Toolbar
            onDragStart={handleDragStart}
            onExport={handleExport}
            onSave={handleSave}
          />
        )}
        
        {user ? (
          currentDiagram ? (
            <Canvas
              diagram={currentDiagram}
              onUpdateDiagram={updateDiagram}
              draggedElement={draggedElement}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                {diagramsLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando diagramas...</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Bem-vindo ao BPMN Designer
                    </h2>
                    <p className="text-gray-600 mb-4">
                      Crie seu primeiro diagrama para começar
                    </p>
                    <button
                      onClick={() => handleCreateDiagram('Meu Primeiro Diagrama')}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Criar Primeiro Diagrama
                    </button>
                  </>
                )}
              </div>
            </div>
          )
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center max-w-md mx-auto p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                BPMN Designer
              </h2>
              <p className="text-gray-600 mb-8">
                Crie diagramas BPMN profissionais com o poder da inteligência artificial. 
                Faça login para salvar seus diagramas na nuvem.
              </p>
              <button
                onClick={() => setShowAuth(true)}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Começar Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {user && (
        <ChatPanel
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          messages={messages}
          onSendMessage={handleChatMessage}
          isLoading={isLoading}
          settings={settings}
          onUpdateSettings={updateSettings}
        />
      )}

      {showAbout && (
        <AboutPage onClose={() => setShowAbout(false)} />
      )}

      {showHelp && (
        <HelpPage onClose={() => setShowHelp(false)} />
      )}

      {showAuth && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

export default App;