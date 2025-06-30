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
  const { user, loading: authLoading, isConfigured } = useAuth();
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

  // Criar diagrama padrão se não houver nenhum
  useEffect(() => {
    if (!authLoading && !diagramsLoading && diagrams.length === 0) {
      createDiagram('Meu Primeiro Diagrama');
    }
  }, [authLoading, diagramsLoading, diagrams.length]);

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
            <div className="text-center max-w-md mx-auto px-4">
              {diagramsLoading ? (
                <>
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando diagramas...</p>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                      Bem-vindo ao BPMN Designer
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {isConfigured && user 
                        ? 'Crie seu primeiro diagrama para começar'
                        : 'Ferramenta profissional para criar diagramas BPMN'
                      }
                    </p>
                  </div>

                  {!isConfigured && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <div>
                          <p className="text-yellow-800 text-sm font-medium">Modo Local Ativo</p>
                          <p className="text-yellow-700 text-xs mt-1">
                            Seus diagramas serão salvos apenas no navegador. Configure o Supabase para salvar na nuvem e fazer login.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <button
                      onClick={() => handleCreateDiagram('Meu Primeiro Diagrama')}
                      className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Criar Primeiro Diagrama
                    </button>

                    {isConfigured && !user && (
                      <button
                        onClick={() => setShowAuth(true)}
                        className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        Fazer Login
                      </button>
                    )}
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                      Arraste elementos da barra superior para criar diagramas BPMN profissionais
                    </p>
                  </div>
                </>
              )}
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

      {showAuth && isConfigured && (
        <AuthModal
          isOpen={showAuth}
          onClose={() => setShowAuth(false)}
        />
      )}
    </div>
  );
}

export default App;